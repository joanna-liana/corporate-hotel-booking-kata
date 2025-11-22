export class BookingPolicyService {
  setCompanyPolicy(companyId: string, roomTypes: string[]): void {
    throw new Error('Not implemented');
  }

  setEmployeePolicy(employeeId: string, roomTypes: string[]): void {
    throw new Error('Not implemented');
  }

  isBookingAllowed(employeeId: string, roomType: string): boolean {
    throw new Error('Not implemented');
  }
}
