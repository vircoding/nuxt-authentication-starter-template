export class CustomVerifiedError extends Error {
  name: string;

  constructor(message: string) {
    super(message);
    this.name = 'User Verified Error';
  }
}
