import { BriefModel, BriefDocument } from '../models/Brief';
import { isMongoConnected } from '../db';

const memoryBriefs: BriefDocument[] = [] as unknown as BriefDocument[];

export async function createBrief(data: Partial<BriefDocument>): Promise<BriefDocument> {
  if (isMongoConnected()) {
    const doc = await BriefModel.create(data);
    return doc;
  }
  const doc = {
    _id: `${Date.now()}`,
    serviceType: data.serviceType || '',
    name: data.name || '',
    email: data.email || '',
    phone: data.phone,
    company: data.company,
    budgetRange: data.budgetRange,
    deadline: data.deadline,
    message: data.message,
    serviceSpecificData: data.serviceSpecificData,
    createdAt: new Date()
  } as unknown as BriefDocument;
  memoryBriefs.push(doc);
  return doc;
}
