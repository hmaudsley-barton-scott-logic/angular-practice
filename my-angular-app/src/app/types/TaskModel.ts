export interface TaskModel {
  id: string;
  reporterId: string;
  assigneeId: string;
  reporterName: string;
  assigneeName: string;
  summary: string;
  details: string;
  creationDate: Date;
  updatedDate: Date;
}
