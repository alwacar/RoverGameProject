using System;
using System.Collections.Generic;
using System.Linq;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using roverapi.Model;

namespace roverapi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class RoverController : ControllerBase
    {
        [HttpGet]
        [Route("Version", Name = "Version")]
        public async Task<string> Version()
        {
            return await Task.Run<string>(() => "1.0.0");
        }
        [HttpGet]
        public async Task<Transport> Get()
        {
            Transport transport = new Transport();
            transport.cardinal = Cardinal.South;
            transport.obstacles = RandomData.LoadObstacules();
            transport.coordinate = RandomData.GetStartPoint();
            return await Task.Run<Transport>(() => transport);
        }

        [HttpPut]
        public async Task<Transport> Put([FromBody] Transport transport)
        {
            int x = (int)transport.coordinate.X;
            int y = (int)transport.coordinate.Y;
            string validCommands = "";
            foreach (var movement in transport.data.Split(','))
            {
                Direction direction = Direction.Backward;
                switch (movement)
                {
                    case "B":
                        break;
                    case "F":
                        direction = Direction.Forward;
                        break;
                    case "L":
                        direction = Direction.Left;
                        break;
                    case "R":
                        direction = Direction.Right;
                        break;
                }
                switch (transport.cardinal)
                {
                    case Cardinal.North:
                        switch (direction)
                        {
                            case Direction.Forward:
                                y -= 20;
                                break;
                            case Direction.Backward:
                                transport.cardinal = Cardinal.South;
                                y += 20;
                                break;
                            case Direction.Right:
                                transport.cardinal = Cardinal.East;
                                x += 20;
                                break;
                            case Direction.Left:
                                transport.cardinal = Cardinal.West;
                                x -= 20;
                                break;
                        }
                        break;

                    case Cardinal.East:
                        switch (direction)
                        {
                            case Direction.Forward:
                                x += 20;
                                break;
                            case Direction.Backward:
                                transport.cardinal = Cardinal.West;
                                x -= 20;
                                break;
                            case Direction.Right:
                                transport.cardinal = Cardinal.South;
                                y += 20;
                                break;
                            case Direction.Left:
                                transport.cardinal = Cardinal.North;
                                y -= 20;
                                break;
                        }
                        break;

                    case Cardinal.West:
                        switch (direction)
                        {
                            case Direction.Forward:
                                x -= 20;
                                break;
                            case Direction.Backward:
                                transport.cardinal = Cardinal.East;
                                x += 20;
                                break;
                            case Direction.Right:
                                transport.cardinal = Cardinal.North;
                                y -= 20;
                                break;
                            case Direction.Left:
                                transport.cardinal = Cardinal.South;
                                y += 20;
                                break;
                        }
                        break;

                    case Cardinal.South:
                        switch (direction)
                        {
                            case Direction.Forward:
                                y += 20;
                                break;
                            case Direction.Backward:
                                transport.cardinal = Cardinal.North;
                                y -= 20;
                                break;
                            case Direction.Right:
                                transport.cardinal = Cardinal.West;
                                x -= 20;
                                break;
                            case Direction.Left:
                                transport.cardinal = Cardinal.East;
                                x += 20;
                                break;
                        }
                        break;
                }
                
                if (x < 0) {
                    x = Canvas.canvasWidth - 20;
                }

                if (y < 0) {
                    y = Canvas.canvasHeight - 20;
                }

                if (x > Canvas.canvasWidth) {
                    x = 20;
                }

                if (y > Canvas.canvasHeight) {
                    y = 20;
                }

                if (!RandomData.allObstacules.Contains(new System.Drawing.Point(x, y)))
                {
                    if (validCommands.Length > 0)
                    {
                        validCommands += ",";
                    }
                    validCommands += movement;
                } else {
                    break;
                }
            }
            transport.data = validCommands;
            return await Task.Run<Transport>(() => transport);
        }

    }
}
