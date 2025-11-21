import { HttpException, HttpStatus } from '@nestjs/common';

export class TermiiGeneralException extends HttpException {
  constructor(message: string, status: HttpStatus) {
    super(message, status);
  }
}

export class TermiiApiKeyInvalidException extends TermiiGeneralException {
  constructor(message = 'Invalid API Key') {
    super(message, HttpStatus.UNAUTHORIZED);
  }
}

export class TermiiInsufficientBalanceException extends TermiiGeneralException {
  constructor(message = 'Insufficient Balance') {
    super(message, HttpStatus.PAYMENT_REQUIRED);
  }
}

export class TermiiNotFoundException extends TermiiGeneralException {
  constructor(message = 'Not Found') {
    super(message, HttpStatus.NOT_FOUND);
  }
}
