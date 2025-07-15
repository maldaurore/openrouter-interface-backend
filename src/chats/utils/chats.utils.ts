import mongoose from "mongoose";
import { ChatType } from "types";


export function generateId(type: ChatType, externalId?: string): string {
  switch (type) {
    case 'braian':
    case 'assistant':
      if (!externalId) throw new Error('external ID required');
      return externalId;
    case 'model':
    default:
      return new mongoose.Types.ObjectId().toString();
  }
}
