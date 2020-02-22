declare interface IRendererCaller<T> {
  (r: TRenderer<T>): Promise<string> | string | void;
}
declare interface IHandler<T> {
  (r: TRenderer<T>, content: string, options: any): Promise<string> | string;
}

declare type TRenderer<T = {}> =
  {
    define: <S extends string>(tag: S, handler: IHandler<T & { [k in S]: {} }>) => TRenderer<T & { [k in S]: {} }>,
    r: <S extends keyof T>(tag: S, content?: string | IRendererCaller<T>, options?: T[S]) => TRenderer<T>,
    g: () => Promise<string>,
    sub: () => TRenderer<T>
  } & {
    [S in keyof T]: (content?: string | IRendererCaller<T>, options?: T[S]) => TRenderer<T>
  } & {
    (content: string): TRenderer<T>
  }

declare const renderer: TRenderer

export default renderer
