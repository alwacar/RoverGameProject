import { HttpClient, HttpHeaders } from '@angular/common/http';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, ViewChild, ElementRef, OnInit, HostListener, Inject } from '@angular/core';
import { Cardinal, Direction, Square, Transport, TransportIn } from './square';

@Component({
  selector: 'rover-component',
  templateUrl: 'rover.component.html',
  styles: ['canvas { border-style: solid }']
})
export class RoverComponent implements OnInit {
  @ViewChild('canvas', { read: ElementRef, static: true }) canvas!: ElementRef<HTMLCanvasElement>;
  ctx!: any;

  private square!: Square;
  public commands: string[] = [];
  public previewCommands: string[] = [];
  public disabledCommand = true;
  public transportData!: Transport;
  public baseUrl: string = '';
  public forward:string = 'up';
  public backward:string = 'down';
  public left:string = 'left';
  public right:string = 'right';
  public order0: string = "order-0";
  public order1: string = "order-1";
  public order2: string = "order-2";
  public order3: string = "order-3";

  constructor(private http: HttpClient, @Inject('BASE_URL') baseUrl: string) {

    http.get<Transport>(baseUrl + 'Rover').subscribe(result => {
      this.baseUrl = baseUrl;
      this.transportData = result;
      this.ctx = this.canvas.nativeElement.getContext('2d');
      this.square = new Square(this.ctx);
      this.square.x = parseInt(this.transportData.coordinate.x);
      this.square.y = parseInt(this.transportData.coordinate.y);
      this.square.svx = this.square.x;
      this.square.svy = this.square.y;
      this.square.cardinal = this.transportData.cardinal;
      this.square.svcardinal = this.transportData.cardinal;
      this.square.obstacules = this.transportData.obstacles;
      this.RefreshCommands(this.square.cardinal);
      this.square.initial();
    }, error => console.error(error));
  }

  ngOnInit() {
  }

  public Command(command: string) {
    if (command === 'C') {
      this.commands.pop();
    } else {
      this.commands.push(command);
      this.previewCommands.push(command)
      this.MoveRover(this.previewCommands, true);
      this.previewCommands = [];
    }
    this.disabledCommand = this.commands.length == 0;
  }

  public Send() {
    this.square.x = this.square.svx;
    this.square.y = this.square.svy;
    this.square.cardinal = this.square.svcardinal;
          
    const headers: HttpHeaders = new HttpHeaders().set('Content-Type', 'application/json');
    const httpOptions = { headers };
    const transport: TransportIn = {
      coordinate: { isEmpty: false, x: this.square.x.toString(), y: this.square.y.toString() },
      cardinal: this.square.cardinal,
      data: this.commands.toLocaleString()
    };

    this.http.put<Transport>(this.baseUrl + 'Rover',
      JSON.stringify(transport), httpOptions).subscribe(result => {
        this.commands = [];
        if (result.data.length > 0) {
          this.MoveRover(result.data.split(','), false);
        } else {
          this.square.initial();
        }
        this.square.svx = this.square.x;
        this.square.svy = this.square.y;
        this.square.svcardinal = this.square.cardinal;
      }, error => console.error(error));
    this.disabledCommand = true;
  }

  MoveRover(commands: string[], preview: boolean) {
    commands.forEach(command => {
      switch (command) {
        case "F":
          this.square.move(Direction.Forward, preview);
          break;
        case "B":
          this.square.move(Direction.Backward, preview);
          break;
        case "L":
          this.square.move(Direction.Left, preview);
         break;
        case "R":
          this.square.move(Direction.Right, preview);
          break;
      }
    });
    this.RefreshCommands(this.square.cardinal);
  }

  RefreshCommands(cardinal: Cardinal) {
    switch (cardinal) {
      case Cardinal.North:
        this.forward = 'up';
        this.backward = 'down';
        this.left = 'left';
        this.right = 'right';
        this.order0 = "order-0";
        this.order1 = "order-1";
        this.order2 = "order-2";
        this.order3 = "order-3";
        break;
      case Cardinal.South:
        this.forward = 'down';
        this.backward = 'up';
        this.left = 'right';
        this.right = 'left';
        this.order0 = "order-1";
        this.order1 = "order-0";
        this.order2 = "order-3";
        this.order3 = "order-2";
        break;
      case Cardinal.West:
        this.forward = 'left';
        this.backward = 'right';
        this.left = 'down';
        this.right = 'up';
        this.order0 = "order-2";
        this.order1 = "order-3";
        this.order2 = "order-1";
        this.order3 = "order-0";
        break;
      case Cardinal.East:
        this.forward = 'right';
        this.backward = 'left';
        this.left = 'up';
        this.right = 'down';
        this.order0 = "order-3";
        this.order1 = "order-2";
        this.order2 = "order-0";
        this.order3 = "order-1";
        break;
    }
  }

  @HostListener('window:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (event.code === "Enter" && this.commands.length > 0) {
      this.Send();
    } else {
      switch (this.square.cardinal) {
        case Cardinal.North:
          switch (event.code) {
            case "ArrowUp":
              this.Command('F');
              break;
            case "ArrowDown":
              this.Command('B');
              break;
            case "ArrowLeft":
              this.Command('L');
              break;
            case "ArrowRight":
              this.Command('R');
              break;
          }
          break;
        case Cardinal.South:
          switch (event.code) {
            case "ArrowUp":
              this.Command('B');
              break;
            case "ArrowDown":
              this.Command('F');
              break;
            case "ArrowLeft":
              this.Command('R');
              break;
            case "ArrowRight":
              this.Command('L');
              break;
          }
          break;
        case Cardinal.West:
          switch (event.code) {
            case "ArrowUp":
              this.Command('R');
              break;
            case "ArrowDown":
              this.Command('L');
              break;
            case "ArrowLeft":
              this.Command('F');
              break;
            case "ArrowRight":
              this.Command('B');
              break;
          }
          break;
        case Cardinal.East:
          switch (event.code) {
            case "ArrowUp":
              this.Command('L');
              break;
            case "ArrowDown":
              this.Command('R');
              break;
            case "ArrowLeft":
              this.Command('B');
              break;
            case "ArrowRight":
              this.Command('F');
              break;
          }
          break;
      }
    }
  }
}
