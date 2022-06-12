using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Threading.Tasks;

namespace roverapi.Model
{
    public enum Direction
    {
        Forward = 1,
        Backward,
        Left,
        Right
    }

    public enum Cardinal
    {
        North = 1,
        West,
        East,
        South
    }

    public static class Canvas
    {
        public static int canvasWidth = 500;
        public static int canvasHeight = 500;

    }

    public class Transport
    {
        public Point coordinate { get; set; }
        public Cardinal cardinal { get; set; }
        public string data { get; set; }
        public List<Point> obstacles { get; set; } = new List<Point>();
    }

    public static class RandomData
    {
        public static List<Point> allObstacules = new List<Point>();
        public static System.Drawing.Point GetStartPoint()
        {
            bool found = false;
            Random rnd = new Random();
            Point startPoint = new Point();
            while (!found)
            {
                int x = rnd.Next(20, 501);
                int y = rnd.Next(20, 501);
                while (x % 20 != 0)
                {
                    x = rnd.Next(20, 501);
                }
                while (y % 20 != 0)
                {
                    y = rnd.Next(20, 501);
                }
                startPoint.X = x;
                startPoint.Y = y;
                if (allObstacules.Contains(startPoint)) {
                    continue;
                }
                found = true;
            }
            return startPoint;
        }

        public static List<Point> LoadObstacules()
        {
            if (allObstacules.Count() == 0)
            {
                Random rnd = new Random();
                for (int i = 0; i < 100; i++)
                {
                    int x = rnd.Next(20, 501);
                    int y = rnd.Next(20, 501);
                    while (x % 20 != 0)
                    {
                        x = rnd.Next(20, 501);
                    }
                    while (y % 20 != 0)
                    {
                        y = rnd.Next(20, 501);
                    }
                    allObstacules.Add(new System.Drawing.Point(x, y));
                }
            }
            return allObstacules;
        }

    }


}
