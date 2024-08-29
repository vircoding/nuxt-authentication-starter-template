import fs from 'fs';
import { join } from 'path';
import handlebars from 'handlebars';

const DIR = 'server/templates';

export const getVerificationEmail = async (username: string, verificationToken: string) => {
  const file = fs.readFileSync(join(DIR, 'verificationEmail.hbs'));
  const template = handlebars.compile(file.toString());
  return template({ username, verificationToken });
};

export const getVerificationSuccess = async (username: string) => {
  const file = fs.readFileSync(join(DIR, 'verificationSuccess.hbs'));
  const template = handlebars.compile(file.toString());
  return template({ username });
};

export const getVerificationIsVerified = async () => {
  const file = fs.readFileSync(join(DIR, 'verificationIsVerified.hbs'));
  const template = handlebars.compile(file.toString());
  return template({});
};

export const getVerificationFailed = async () => {
  const file = fs.readFileSync(join(DIR, 'verificationFailed.hbs'));
  const template = handlebars.compile(file.toString());
  return template({});
};
