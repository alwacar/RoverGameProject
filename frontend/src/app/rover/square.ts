export enum Direction {
  Forward = 1,
  Backward,
  Left,
  Right
}

export enum Cardinal {
  North = 1,
  West,
  East,
  South
}

export class Square {

  private fillColor = 'black';
  private textColor = 'white';
  private previewColor = 'wheat';
  public cardinal: Cardinal = Cardinal.North;
  public direction: Direction = Direction.Forward;
  public obstacules!: Array<Coordinate>;
  public x = 0;
  public y = 20;
  public svx = 0;
  public svy = 20;
  public svcardinal: Cardinal = Cardinal.North;
  

  constructor(private ctx: CanvasRenderingContext2D) { }

  public initial() {
    this.draw(false, true);
  }

  public move(direction: Direction, preview: boolean) {
    this.direction = direction;
    this.draw(preview, false);
  }

  private draw(preview: boolean, initial: boolean) {
    let x = 1;
    let y = 12;
  
    switch (this.cardinal) {
      case Cardinal.North:
        switch (this.direction) {
          case Direction.Forward:
            y -= 5;
            this.y -= 20;
            break;
          case Direction.Backward:
            this.cardinal = Cardinal.South;
            this.y += 20;
            y += 5;
            break;
          case Direction.Right:
            this.cardinal = Cardinal.East;
            this.x += 20;
            x += 5;
            break;
          case Direction.Left:
            this.cardinal = Cardinal.West;
            this.x -= 20;
            x -= 5;
            break;
        }
        break;

      case Cardinal.East:
        switch (this.direction) {
          case Direction.Forward:
            x += 5;
            this.x += 20;
            break;
          case Direction.Backward:
            this.cardinal = Cardinal.West;
            this.x -= 20;
            x -= 5;
            break;
          case Direction.Right:
            this.cardinal = Cardinal.South;
            this.y += 20;
            y += 5;
            break;
          case Direction.Left:
            this.cardinal = Cardinal.North;
            this.y -= 20;
            y -= 5;
            break;
        }
        break;

      case Cardinal.West:
        switch (this.direction) {
          case Direction.Forward:
            x -= 5;
            this.x -= 20;
            break;
          case Direction.Backward:
            this.cardinal = Cardinal.East;
            this.x += 20;
            x += 5;
            break;
          case Direction.Right:
            this.cardinal = Cardinal.North;
            this.y -= 20;
            y -= 5;
            break;
          case Direction.Left:
            this.cardinal = Cardinal.South;
            this.y += 20;
            y += 5;
            break;
        }
        break;

      case Cardinal.South:
        switch (this.direction) {
          case Direction.Forward:
            y += 5;
            this.y += 20;
            break;
          case Direction.Backward:
            this.cardinal = Cardinal.North;
            this.y -= 20;
            y -= 5;
            break;
          case Direction.Right:
            this.cardinal = Cardinal.West;
            this.x -= 20;
            x -= 5;
            break;
          case Direction.Left:
            this.cardinal = Cardinal.East;
            this.x += 20;
            x += 5;
            break;
        }
        break;
    }

    if (initial) {
      this.x = this.svx;
      this.y = this.svy;
    }

    if (this.x + x >= this.ctx.canvas.width) {
      this.x = 0;
    } else if (this.y + y >= this.ctx.canvas.height) {
      this.y = 0;
    } else if (this.x + x < -20) {
      this.x = this.ctx.canvas.width - 20;
    } else if (this.y + y < 0) {
      this.y = this.ctx.canvas.height - 20;
    }

    this.drawGrid(x, y, preview);

  }

  public drawGrid(x: number, y: number, preview: boolean) {
    if (!preview) {
      this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    }
    this.ctx.fillStyle = 'lightgray';
    this.obstacules.forEach(obstacule => {
      this.ctx.fillRect(parseInt(obstacule.x), parseInt(obstacule.y), 20, 20);
    });
    for (let xx = 20; xx < this.ctx.canvas.width; xx += 20) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, this.ctx.canvas.width - xx);
      this.ctx.lineTo(this.ctx.canvas.width, this.ctx.canvas.width - xx);
      this.ctx.stroke();
    }
    for (let yy = 20; yy < this.ctx.canvas.height; yy += 20) {
      this.ctx.beginPath();
      this.ctx.moveTo(yy, 0);
      this.ctx.lineTo(yy, this.ctx.canvas.height);
      this.ctx.stroke();
    }

    if (preview) {
      this.ctx.fillStyle = this.previewColor;
    } else {
      this.ctx.fillStyle = this.fillColor;
    }

    this.ctx.fillRect(this.x, this.y, 20, 20);
    this.ctx.font = "bold 20pt Courier";
    this.ctx.fillStyle = this.textColor;
    this.ctx.fillText(".", this.x + x, this.y + y, 40);

  }
  
}

export interface Coordinate {
  isEmpty: boolean;
  x: string;
  y: string;
}

export interface TransportIn {
  coordinate: Coordinate;
  cardinal: number;
  data: string;
}
export interface Transport extends TransportIn {
  coordinate: Coordinate;
  cardinal: number;
  data: string;
  obstacles: Array<Coordinate>;
}