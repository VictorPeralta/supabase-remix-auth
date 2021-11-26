import React from "react";
import {
  ActionFunction,
  Form,
  LinksFunction,
  redirect,
  useActionData,
  useFormAction,
} from "remix";
import { supabase } from "~/supabase";
import stylesUrl from "../styles/auth.css";

export let links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: stylesUrl }];
};

interface LoginActionData {
  emailInvalid: boolean;
  passwordInvalid: boolean;
}

export const action: ActionFunction = async ({
  request,
}): Promise<LoginActionData | Response> => {
  let formData = await request.formData();
  let email = formData.get("email");
  let password = formData.get("password");

  let errors: Record<keyof LoginActionData, boolean> = {
    emailInvalid: !email,
    passwordInvalid: !password,
  };

  //If any errors are true, return error object
  if (Object.values(errors).some((e) => e)) {
    return errors;
  }

  return redirect("/");
};

export default function Login() {
  const actionData = useActionData<LoginActionData>();
  console.log(actionData);

  return (
    <div>
      <p>Login to your app</p>
      <Form method="post">
        <label>
          Email
          <input name="email" type="email" />
        </label>
        {actionData?.emailInvalid && <p>email is required</p>}
        <label>
          Password
          <input name="password" type="password" />
        </label>
        <button type="submit">Login</button>
      </Form>
      {actionData?.passwordInvalid && <p>password is required</p>}
    </div>
  );
}
