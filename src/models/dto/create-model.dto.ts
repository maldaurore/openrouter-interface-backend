import { IsIn, IsString } from "class-validator";

export class CreateModelDto {
  @IsString()
  modelId: string;

  @IsString()
  name: string;

  @IsIn(["model", "assistant", "braian"])
  type: "model" | "assistant" | "braian"

}
