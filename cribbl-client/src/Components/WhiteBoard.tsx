import React, { useEffect, useRef, useState } from "react";

type MouseEventHandler = React.MouseEventHandler<HTMLCanvasElement> | undefined;

const WhiteBoard = ({ io, gameId }: { io: any; gameId: string }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [canvasState, setCanvasState] = useState({
    canDraw: true,
    showWordsBox: false,
    showScoreBoard: false,
    drawing: false,
    current: {
      x: 1,
      y: 1,
      color: "#000000",
      width: 1,
    },
    board: {
      x: 1,
      y: 1,
    },
    mode: "pencil",
  });

  useEffect(() => {
    clearCanvas();
    io.on(
      "game:draw",
      (
        data: [number, number, number, number, { color: string; width: number }]
      ) => {
        drawLine(...data, false);
      }
    );
    io.on("game:fill", (data: [number, number, string]) => {
      console.log(data);
      fill(...data);
    });
    io.on("game:clear", () => {
      clearCanvas(false);
    });

    io.on("lol", () => {
      console.log("LOLLLLLL");
    });
    return () => {};
  }, []);

  console.log("WHITEBOARD");

  const clearCanvas = (emit = true) => {
    const ctx = canvasRef.current!.getContext("2d")!;
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, 700, 500);
    if (emit) io.emit("game:clear", gameId);
  };

  const onMouseDown: MouseEventHandler = (e) => {
    if (canvasState.mode == "fill") return;
    console.log("DOWN");

    const x = e.clientX - canvasRef.current!.getBoundingClientRect().x;
    const y = e.clientY - canvasRef.current!.getBoundingClientRect().y;

    setCanvasState({
      ...canvasState,
      drawing: true,
      current: {
        ...canvasState.current,
        x,
        y,
      },
    });
  };

  const onMouseMove: MouseEventHandler = (e) => {
    if (!canvasState.drawing || canvasState.mode == "fill") {
      return;
    }
    console.log("MOVE");

    const x = e.clientX - canvasRef.current!.getBoundingClientRect().x;
    const y = e.clientY - canvasRef.current!.getBoundingClientRect().y;

    drawLine(
      canvasState.current.x,
      canvasState.current.y,
      x,
      y,
      { color: canvasState.current.color },
      true
    );
    setCanvasState({
      ...canvasState,
      current: {
        ...canvasState.current,
        x,
        y,
      },
    });
  };

  const onMouseUp: MouseEventHandler = (e) => {
    if (!canvasState.drawing || canvasState.mode == "fill") {
      return;
    }
    console.log("UP");
    setCanvasState({
      ...canvasState,
      drawing: false,
    });
    drawLine(
      canvasState.current.x,
      canvasState.current.y,
      e.clientX - canvasRef.current!.getBoundingClientRect().x,
      e.clientY - canvasRef.current!.getBoundingClientRect().y,
      { color: canvasState.current.color },
      true
    );
  };

  const drawLine = (
    x0: number,
    y0: number,
    x1: number,
    y1: number,
    { color, width }: { color: string; width?: number },
    emit: boolean
  ) => {
    const context = canvasRef.current?.getContext("2d")!;
    context.beginPath();
    context.moveTo(x0, y0);
    context.lineTo(x1, y1);
    context.strokeStyle = color;
    context.lineWidth = width ? width : canvasState.current.width;
    context.stroke();
    context.closePath();

    if (!emit) {
      return;
    }

    io.emit("game:drawing", [
      x0,
      y0,
      x1,
      y1,
      { color, width: width ? width : canvasState.current.width },
      gameId,
    ]);
    // image64:this.board.toDataURL("image/png")
    // });
    // var w = canvasRef.current!.width;
    // var h = canvasRef.current!.height;

    // this.$socket.client.emit('drawing', {
    //     x0: x0 / w,
    //     y0: y0 / h,
    //     x1: x1 / w,
    //     y1: y1 / h,
    //     color: color,
    //     width:width? width: this.current.width,
    //     roomId:this.roomId,
    //     // image64:this.board.toDataURL("image/png")
    // });
  };

  const onClick: MouseEventHandler = (e) => {
    if (canvasState.mode == "fill") {
      const x = e.clientX - canvasRef.current!.getBoundingClientRect().x;
      const y = e.clientY - canvasRef.current!.getBoundingClientRect().y;
      console.log("FILL");
      fill(x, y, canvasState.current.color);
      io.emit("game:fill", [x, y, canvasState.current.color, gameId]);
    }
  };

  const fill = (x: number, y: number, color: string) => {
    const ctx = canvasRef.current!.getContext("2d")!;
    console.log("CONTEXT", ctx);
    if (ctx) {
      const imageData = ctx.getImageData(
        0,
        0,
        canvasRef.current?.width || 700,
        canvasRef.current?.height || 500
      );

      const col = hexToRGB(color);
      floodFill(imageData, col, x, y);
      ctx.putImageData(imageData, 0, 0);
    }
  };
  const words = ["Wizard", "Hat", "Car"];

  return (
    <div className="flex flex-col items-center">
      <div
        className="relative"
        style={{
          width: 700,
          height: 500,
        }}
      >
        <canvas
          ref={canvasRef}
          width="700"
          height="500"
          onClick={onClick}
          onMouseUp={onMouseUp}
          onMouseMove={onMouseMove}
          onMouseDown={onMouseDown}
        ></canvas>
        {canvasState.showWordsBox && (
          <div className="h-full w-full flex justify-center items-center absolute top-0 left-0 bg-black opacity-80">
            <div className="w-4/12 flex justify-between items-center">
              {words.map((word) => {
                return (
                  <button className="rounded bg-yellow-500 px-4 py-2">
                    {word}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
      {canvasState.canDraw && (
        <div className="flex my-3">
          <div
            className="w-10 h-10 mr-2"
            style={{
              backgroundColor: canvasState.current.color,
            }}
          ></div>

          <div className="grid grid-cols-12">
            {colors.map((color) => {
              return (
                <div
                  className="w-5 h-5"
                  key={color}
                  onClick={() =>
                    setCanvasState({
                      ...canvasState,
                      current: {
                        ...canvasState.current,
                        color,
                      },
                    })
                  }
                  style={{
                    backgroundColor: color,
                  }}
                ></div>
              );
            })}
          </div>
          <div className="flex">
            <div
              className={`w-10 h-10 bg-white`}
              onClick={() =>
                setCanvasState({
                  ...canvasState,
                  mode: "pencil",
                })
              }
            >
              P
            </div>
            <div
              className="w-10 h-10 bg-white"
              style={{
                background: "",
              }}
              onClick={() =>
                setCanvasState({
                  ...canvasState,
                  mode: "eraser",
                  current: {
                    ...canvasState.current,
                    color: "#fff",
                  },
                })
              }
            >
              E
            </div>
            <div
              className="w-10 h-10 bg-white"
              style={{
                background: "",
              }}
              onClick={() =>
                setCanvasState({
                  ...canvasState,
                  mode: "fill",
                })
              }
            >
              F
            </div>
          </div>
          <div className="flex">
            {[1, 2, 5, 8].map((stroke) => (
              <div
                key={stroke}
                className={`w-10 h-10 bg-white`}
                onClick={() =>
                  setCanvasState({
                    ...canvasState,
                    current: {
                      ...canvasState.current,
                      width: stroke,
                    },
                  })
                }
              >
                {stroke}
              </div>
            ))}
            <div className={`w-10 h-10 bg-white`} onClick={clearCanvas}>
              Clear
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Flood Fill
// Reference - https://codepen.io/Geeyoam/pen/vLGZzG

function hexToRGB(hex: any) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  return {
    r,
    g,
    b,
    a: 255,
  };
}

function getColorAtPixel(imageData: any, x: any, y: any) {
  const { width, data } = imageData;

  return {
    r: data[4 * (width * y + x) + 0],
    g: data[4 * (width * y + x) + 1],
    b: data[4 * (width * y + x) + 2],
    a: data[4 * (width * y + x) + 3],
  };
}

function setColorAtPixel(imageData: any, color: any, x: any, y: any) {
  const { width, data } = imageData;

  data[4 * (width * y + x) + 0] = color.r & 0xff;
  data[4 * (width * y + x) + 1] = color.g & 0xff;
  data[4 * (width * y + x) + 2] = color.b & 0xff;
  data[4 * (width * y + x) + 3] = color.a & 0xff;
}

function colorMatch(a: any, b: any) {
  return a.r === b.r && a.g === b.g && a.b === b.b && a.a === b.a;
}

function floodFill(imageData: any, newColor: any, x: any, y: any) {
  console.log("SAD");
  const { width, height, data } = imageData;
  const stack = [];
  const baseColor = getColorAtPixel(imageData, x, y);
  let operator = { x, y };

  console.log(baseColor, newColor);
  // Check if base color and new color are the same
  if (colorMatch(baseColor, newColor)) {
    return;
  }

  // Add the clicked location to stack
  stack.push({ x: operator.x, y: operator.y });

  while (stack.length) {
    operator = stack.pop()!;
    let contiguousDown = true; // Vertical is assumed to be true
    let contiguousUp = true; // Vertical is assumed to be true
    let contiguousLeft = false;
    let contiguousRight = false;

    // Move to top most contiguousDown pixel
    while (contiguousUp && operator.y >= 0) {
      operator.y--;
      contiguousUp = colorMatch(
        getColorAtPixel(imageData, operator.x, operator.y),
        baseColor
      );
    }

    // Move downward
    while (contiguousDown && operator.y < height) {
      setColorAtPixel(imageData, newColor, operator.x, operator.y);

      // Check left
      if (
        operator.x - 1 >= 0 &&
        colorMatch(
          getColorAtPixel(imageData, operator.x - 1, operator.y),
          baseColor
        )
      ) {
        if (!contiguousLeft) {
          contiguousLeft = true;
          stack.push({ x: operator.x - 1, y: operator.y });
        }
      } else {
        contiguousLeft = false;
      }

      // Check right
      if (
        operator.x + 1 < width &&
        colorMatch(
          getColorAtPixel(imageData, operator.x + 1, operator.y),
          baseColor
        )
      ) {
        if (!contiguousRight) {
          stack.push({ x: operator.x + 1, y: operator.y });
          contiguousRight = true;
        }
      } else {
        contiguousRight = false;
      }

      operator.y++;
      contiguousDown = colorMatch(
        getColorAtPixel(imageData, operator.x, operator.y),
        baseColor
      );
    }
  }
}

const colors = [
  "#fff",
  "#828085",
  "#8A0000",
  "#7C8600",
  "#008703",
  "#00817D",
  "#1C007B",
  "#88007E",
  "#7D833B",
  "#003E46",
  "#0571FF",
  "#003C83",
  "#010006",
  "#9800FF",
  "#873800",
  "#FEFEFE",
  "#BFBEC1",
  "#FF0000",
  "#FAFF00",
  "#00FF08",
  "#00FFFB",
  "#FF732C",
  "#4000FB",
  "#FF00FF",
];
export default WhiteBoard;
