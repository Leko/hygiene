import { AnnotatedComment, Plugin } from "@hygiene/core";

export interface ReportMessage {
  kind: string;
  file: string;
  line: number;
  text: string;
  message: string;
  ruleName: string;
}

export interface Reporter {
  (messages: ReportMessage[]): Promise<void>;
}

export interface ReportWrapper {
  (
    comments: AnnotatedComment[],
    plugins: Plugin<any>[],
    pluginSettings: any[]
  ): Promise<void>;
}
