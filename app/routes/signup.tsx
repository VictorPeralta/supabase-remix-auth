import React from "react";
import {
  ActionFunction,
  Form,
  LinksFunction,
  redirect,
  useActionData,
  useFormAction,
} from "remix";
import { createUserSession } from "~/sessions.server";
import { supabase } from "~/supabase";
import stylesUrl from "../styles/auth.css";

export let links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: stylesUrl }];
};

export function loader() {
  return {
    ENV: {
      PUBLIC_SUPABASE_URL: process.env.PUBLIC_SUPABASE_URL,
      PUBLIC_SUPABASE_ANON_KEY: process.env.PUBLIC_SUPABASE_ANON_KEY,
    },
  };
}

interface SignupActionData {
  emailInvalid: boolean;
  passwordInvalid: boolean;
}

export const action: ActionFunction = async ({
  request,
}): Promise<SignupActionData | Response> => {
  let formData = await request.formData();
  let email = formData.get("email");
  let password = formData.get("password");

  let errors: Record<keyof SignupActionData, boolean> = {
    emailInvalid: !email,
    passwordInvalid: !password,
  };

  //If any errors are true, return error object
  if (Object.values(errors).some((e) => e)) {
    return errors;
  }

  if (typeof email === "string" && typeof password === "string") {
    const res = await supabase.auth.api.createUser({
      email,
      password,
    });
    if (res.data) {
      return createUserSession(res.data.id, "/");
    }

    console.log(res);
  }
  return redirect("/");
};

export default function Signup() {
  const actionData = useActionData<SignupActionData>();
  console.log(actionData);

  return (
    <div>
      <p>Signup to your app</p>
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
        <button type="submit">Signup</button>
      </Form>
      {actionData?.passwordInvalid && <p>password is required</p>}
    </div>
  );
}
