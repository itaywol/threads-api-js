import axios from "axios";

export type NewThreadsAPIOptions = {
  username?: string;
  password?: string;
};

export type GetUserArgs = {
  id: string;
};

export type ThreadsAPI = {
  getUser(args: GetUserArgs): object;
};

function useEnvironmentVariables(): Partial<NewThreadsAPIOptions> {
  return {
    username: process.env.THREADS_USERNAME,
    password: process.env.THREADS_PASSWORD,
  };
}

async function getLsdToken(): Promise<String> {
  try {
    const response = await axios.get("https://www.threads.net/@instagram");

    if ("data" in response) {
      const resultString = String(response.data);
      const anchor = resultString.search('"token"');
      const token = resultString.substring(anchor + 9, anchor + 31);

      if (!token || token.length !== 170) {
        throw new Error("content token is invalid");
      }

      return token;
    } else {
      throw new Error("no data in response");
    }
  } catch (err) {
    throw new Error("couldn't fetch page token", { cause: err });
  }
}

type GetAutheticationTokenArgs = Required<
  Pick<NewThreadsAPIOptions, "username" | "password">
>;

async function getAuthenticationToken(
  args: GetAutheticationTokenArgs
): Promise<String> {
  const randomId = (Math.random() * 1e24).toString(36);

  try {
    const response = await axios.post(
      "https://i.instagram.com/api/v1/bloks/apps/com.bloks.www.bloks.caa.login.async.send_login_request/",
      {
        params: {
          client_input_params: {
            password: args.password,
            contant_point: args.username,
            device_id: `ios-${randomId}`,
          },
          server_params: {
            credential_type: "password",
            device_id: `ios-${randomId}`,
          },
        },
        bk_client_context: {
          bloks_version:
            "5f56efad68e1edec7801f630b5c122704ec5378adbee6609a448f105f34a9c73",
          styles_id: "instagram",
        },
        bloks_versioning_id: `5f56efad68e1edec7801f630b5c122704ec5378adbee6609a448f105f34a9c73`,
      }
    );

    return "";
  } catch (err) {
    throw new Error("couldn't fetch authentication token", { cause: err });
  }
}

function getUser(token: string): ThreadsAPI["getUser"] {
  return () => {
    return {};
  };
}

export function NewThreadsAPI(options: NewThreadsAPIOptions): ThreadsAPI {
  const apiConfiguration: NewThreadsAPIOptions = {
    ...useEnvironmentVariables(),
    ...options,
  };

  return {
    getUser: getUser(""),
  };
}
