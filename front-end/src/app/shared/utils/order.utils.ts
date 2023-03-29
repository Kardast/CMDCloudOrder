import { Order } from "app/common/clients/api.clients";

export function getOrderStageScheduledDate(order: Order, stage: 'cutting' | 'preparation' | 'bending' | 'assembly'): string | null {
  switch (stage) {
    case 'cutting': return order.cuttingScheduledDate;
    case 'preparation': return order.preparationScheduledDate;
    case 'bending': return order.bendingScheduledDate;
    case 'assembly': return order.assemblyScheduledDate;
  }
}

export function getOrderStageStartDate(order: Order, stage: 'cutting' | 'preparation' | 'bending' | 'assembly'): Date | null {
  switch (stage) {
    case 'cutting': return order.cuttingStartDate;
    case 'preparation': return order.preparationStartDate;
    case 'bending': return order.bendingStartDate;
    case 'assembly': return order.assemblyStartDate;
  }
}

export function getOrderStageEndDate(order: Order, stage: 'cutting' | 'preparation' | 'bending' | 'assembly'): Date | null {
  switch (stage) {
    case 'cutting': return order.cuttingEndDate;
    case 'preparation': return order.preparationEndDate;
    case 'bending': return order.bendingEndDate;
    case 'assembly': return order.assemblyEndDate;
  }
}

export function setOrderStageStartDate(order: Order, stage: 'cutting' | 'preparation' | 'bending' | 'assembly', value?: Date): void {
  switch (stage) {
    case 'cutting':
      order.cuttingStartDate = value;
      break;

    case 'preparation':
      order.preparationStartDate = value;
      break;

    case 'bending':
      order.bendingStartDate = value;
      break;

    case 'assembly':
      order.assemblyStartDate = value;
      break;
  }
}

export function setOrderStageEndDate(order: Order, stage: 'cutting' | 'preparation' | 'bending' | 'assembly', value?: Date): void {
  switch (stage) {
    case 'cutting':
      order.cuttingEndDate = value;
      break;

    case 'preparation':
      order.preparationEndDate = value;
      break;

    case 'bending':
      order.bendingEndDate = value;
      break;

    case 'assembly':
      order.assemblyEndDate = value;
      break;
  }
}

export function isOrderStageStarted(order: Order, stage: 'cutting' | 'preparation' | 'bending' | 'assembly'): boolean {
  return getOrderStageStartDate(order, stage) !== null;
}

export function isOrderStageEnded(order: Order, stage: 'cutting' | 'preparation' | 'bending' | 'assembly'): boolean {
  return getOrderStageEndDate(order, stage) !== null;
}

export function isOrderStageInProcess(order: Order, stage: 'cutting' | 'preparation' | 'bending' | 'assembly'): boolean {
  return isOrderStageStarted(order, stage) && !isOrderStageEnded(order, stage);
}