export default class Settings{

    public COLUMNS_COUNT = 101
    public ROWS_COUNT = 101
    public PADDING = 7
    public CELL_SIZE = 7
    public WALL_COLOR = "black"
    public FREE_COLOR = "white"
    public BULDOZER_COLOR = "green"
    public DELAY_TIMEOUT = 0
    public SHOW_ANIMATE = true
    public BULDOZER_COUNTS = 1
    public _ALGORITHM: number

    get algorithm(): number {
        return this._ALGORITHM
    }

    set algorithm(type: number) {
        this._ALGORITHM = type
    }
    
    changeColor(color: string): void {
        this.BULDOZER_COLOR = color
    }
    
    setBuldozersCount(count: number): void {
        this.BULDOZER_COUNTS = count
    }

    setShowAnimation(status: boolean): void {
        this.SHOW_ANIMATE = status
        console.log(this.SHOW_ANIMATE)
    }

    setAnimationDelay(delay: number): void {
        this.DELAY_TIMEOUT = delay
    }
}