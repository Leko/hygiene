export interface BodyParser<Annotation extends {}> {
  /**
   * null means parse failure
   */
  (body: string): Promise<Annotation | null>;
}
