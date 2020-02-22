declare interface IRendererCaller<T> {
  (r: TRenderer<T>): Promise<string> | string | void;
}
declare interface IHandler<T> {
  (r: TRenderer<T>, content: string, options: any): Promise<string> | string;
}

declare type TRenderer<T = {}> =
  {
    define: <S extends string>(tag: S, handler: IHandler<T & { [k in S]: {} }>) => TRenderer<T & { [k in S]: {} }>,
    h: <S extends keyof T>(tag: S, content?: string | IRendererCaller<T>, options?: T[S]) => TRenderer<T>,
    x: () => Promise<string>,
    create: () => TRenderer<T>
  } & {
    [S in keyof T]: (content?: string | IRendererCaller<T>, options?: T[S]) => TRenderer<T>
  } & {
    (content: string): TRenderer<T>
  }

declare const renderer: TRenderer

export default renderer
