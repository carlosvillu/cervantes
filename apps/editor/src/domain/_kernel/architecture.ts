export interface UseCase<Input, Output> {
  execute: (params: Input) => Promise<Output>
}
