import {z} from 'zod'

import {Chapter, ChapterJSON} from './Chapter.js'

const ChaptersValidations = z.object({chapters: z.instanceof(Chapter, {message: 'Chapters required'}).array()})

export interface ChaptersJSON {
  chapters: ChapterJSON[]
}

export class Chapters {
  static create({chapters}: z.infer<typeof ChaptersValidations>) {
    ChaptersValidations.parse({chapters})
    return new Chapters(chapters, false)
  }

  static empty() {
    return new Chapters(undefined, true)
  }

  constructor(public readonly chapters: Chapter[] = [], public readonly empty?: boolean) {}

  titles(): string[] {
    return this.chapters.filter(chapter => !chapter.isEmpty()).map(chapter => chapter.title!)
  }

  ids(): string[] {
    return this.chapters.filter(chapter => !chapter.isEmpty()).map(chapter => chapter.id!)
  }

  isEmpty() {
    return this.empty !== undefined && this.empty
  }

  toJSON() {
    return {
      chapters: this.chapters.map(chapter => chapter.toJSON())
    }
  }
}
