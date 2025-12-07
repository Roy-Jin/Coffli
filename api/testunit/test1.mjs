import bcrypt from 'bcryptjs';

const isPasswordValid = await bcrypt.compare("Wj9264546769", "$2b$10$VNy0Ud3.Mvc1GmXl1mMGy.TZFECfxlaNom4jUEC9sNJhE1uSZWF5i");

console.log(isPasswordValid);