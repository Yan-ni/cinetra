export class GetByEmailQuery {
  private userRepo: any;

  constructor(userRepo: any) {
    this.userRepo = userRepo;
  }

  async execute(email: string) {
    return this.userRepo.findByEmail(email);
  }
}