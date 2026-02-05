interface EventProgram extends Model {
    title: string;
    isPublished: boolean;
    programItems: EventProgramItem[];
}