import { Injectable } from '@nestjs/common';

@Injectable()
export class PreparingStreamingUseCase {
  constructor() {}

  public async execute(id: string) {
    console.log(id);
    return null;
  }
}
