'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { loginAction } from './actions';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button className="btn btn-primary" type="submit" style={{ width: '100%' }} disabled={pending}>
      {pending ? 'Signing in...' : 'Login'}
    </button>
  );
}

export default function LoginForm() {
  const [state, action] = useActionState(loginAction, {});

  return (
    <form action={action}>
      {state?.error ? <div className="alert">{state.error}</div> : null}
      <label className="field">
        Username
        <input className="input" name="username" placeholder="Enter username" required />
      </label>
      <label className="field">
        Password
        <input className="input" name="password" type="password" placeholder="Enter password" required />
      </label>
      <SubmitButton />
    </form>
  );
}
