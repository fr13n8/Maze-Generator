import { CELL, MOUSE, MATRIX } from '../utils/types'
import animate from '../helpers/animate'
import Canvas from '../components/canvas'
import {moveBuldozer} from '../maze-algorithms/oldos-broder'
import {recursiveGenerator} from "../maze-algorithms/recursive-backtracker"
import {getPath} from '../path-algorithms/breadth-first-search'

const BULDOZERS: Array < CELL > = []

let cell1: CELL = null!
let cell2: CELL = null!

const createMouse = (element: HTMLCanvasElement) => {
    const mouse: MOUSE = {
        x: 0,
        y: 0,
        left: false,
        pLeft: false,
        over: false,

        update(): void {
            this.pLeft = this.left
        }
    }

    const mouseenterHandler = (): void => {
        mouse.over = true
    }
    const mouseleaveHandler = (): void => {
        mouse.over = false
    }
    const mousemoveHandler = (event: MouseEvent): void => {
        const rect: DOMRect = element.getBoundingClientRect()
        mouse.x = event.clientX - rect.left
        mouse.y = event.clientY - rect.top
    }
    const mousedownHandler = (): void => {
        mouse.left = true
    }
    const mouseupHandler = (): void => {
        mouse.left = false
    }

    element.addEventListener('mouseenter', mouseenterHandler)
    element.addEventListener('mouseleave', mouseleaveHandler)
    element.addEventListener('mousemove', mousemoveHandler)
    element.addEventListener('mousedown', mousedownHandler)
    element.addEventListener('mouseup', mouseupHandler)

    return mouse
}

const mouse: MOUSE = createMouse(Canvas.canvas)

const tick = async () => {
    requestAnimationFrame(tick)

    if (
        mouse.x < Canvas.PADDING ||
        mouse.y < Canvas.PADDING ||
        mouse.x > Canvas.canvasW - Canvas.PADDING ||
        mouse.y > Canvas.canvasH - Canvas.PADDING
    ) {
        return
    }

    const x: number = Math.floor((mouse.x - Canvas.PADDING) / Canvas.CELL_SIZE)
    const y: number = Math.floor((mouse.y - Canvas.PADDING) / Canvas.CELL_SIZE)

    if (mouse.left && !mouse.pLeft && Canvas.matrix[y][x]) {
        if (!cell1 || cell1.x != x || cell1.y != y) {
            cell2 = cell1
            cell1 = {
                x,
                y
            }

            Canvas.context.beginPath()
            Canvas.context.rect(
                Canvas.PADDING + x * Canvas.CELL_SIZE,
                Canvas.PADDING + y * Canvas.CELL_SIZE,
                Canvas.CELL_SIZE, Canvas.CELL_SIZE)
            Canvas.context.fillStyle = "rgba(200,10,0, 0.5)"
            Canvas.context.fill()
        }

        if (cell1 && cell2) {
            // paths = await getPath(Canvas.matrix, cell1, cell2)
            await getPath(Canvas.matrix, cell1, cell2)
        }

        // if (paths) {
        //     for (let y = 0; y < paths.length; y++) {
        //         paths[y].map((item: boolean | null | number, x: number) => {
        //             if (item !== null && item !== false) {
        //                 Canvas.context.fillStyle = "black"
        //                 Canvas.context.font = "12px serif"
        //                 Canvas.context.textAlign = "center"
        //                 Canvas.context.textBaseline = "middle"
        //                 Canvas.context.fillText(
        //                     paths[y][x].toString(),
        //                     Canvas.PADDING + x * Canvas.CELL_SIZE + Canvas.CELL_SIZE * 0.5,
        //                     Canvas.PADDING + y * Canvas.CELL_SIZE + Canvas.CELL_SIZE * 0.5
        //                 )
        //             }
        //         })
        //     }
        // }

        
        // route.map(async ({
        //     x,
        //     y
        // }: CELL) => {
        //     Canvas.context.beginPath()
        //     Canvas.context.rect(
        //         Canvas.PADDING + x * Canvas.CELL_SIZE,
        //         Canvas.PADDING + y * Canvas.CELL_SIZE,
        //         Canvas.CELL_SIZE, Canvas.CELL_SIZE)
        //     Canvas.context.fillStyle = "rgba(80,100,120, 0.5)"
        //     Canvas.context.fill()
        // })
    }

    mouse.update()
}

const isComlpeted = (): boolean => {
    for (let y = 0; y < Canvas.COLUMNS_COUNT; y += 2) {
        for (let x = 0; x < Canvas.ROWS_COUNT; x += 2) {
            if (!Canvas.matrix[y][x]) return false
        }
    }
    return true
}

export const main = async () => {
    for (let i = 0; i < Canvas.BULDOZER_COUNTS; i++) {
        BULDOZERS.push({
            x: 0,
            y: 0
        })
    }
    switch (Canvas.algorithm) {
        case 0:
            while (!isComlpeted()) {
                for (const BULDOZER of BULDOZERS) {
                    moveBuldozer(BULDOZER)
                }
                await animate(BULDOZERS)
            }
            break
    
        case 1:
            for (const BULDOZER of BULDOZERS) {
                recursiveGenerator(Canvas.matrix, BULDOZER)
            }
            break
        default:
            alert("Choose algorithm")
            return
    }
    Canvas.rerender()
    requestAnimationFrame(tick)
}