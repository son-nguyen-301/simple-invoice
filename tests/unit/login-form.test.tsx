import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { LoginForm } from "@/components/login/login-form";

const { push, refresh } = vi.hoisted(() => ({
  push: vi.fn(),
  refresh: vi.fn(),
}));

vi.mock("next/navigation", () => ({ useRouter: () => ({ push, refresh }) }));

function fill(label: RegExp, value: string) {
  fireEvent.change(screen.getByLabelText(label), { target: { value } });
}

function submit() {
  fireEvent.submit(
    screen.getByRole("button", { name: /sign in/i }).closest("form")!,
  );
}

beforeEach(() => {
  push.mockClear();
  refresh.mockClear();
});
afterEach(() => {
  vi.unstubAllGlobals();
});

describe("LoginForm", () => {
  it("shows required-field errors and does not call the API when empty", () => {
    const fetchMock = vi.fn();

    vi.stubGlobal("fetch", fetchMock);
    render(<LoginForm />);
    submit();
    expect(screen.getByText("Username is required")).toBeInTheDocument();
    expect(screen.getByText("Password is required")).toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("POSTs to /api/login and redirects home on success", async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, status: 200 });

    vi.stubGlobal("fetch", fetchMock);
    render(<LoginForm />);
    fill(/username/i, "94756921275");
    fill(/password/i, "Password@12345");
    submit();
    await waitFor(() => expect(push).toHaveBeenCalledWith("/"));
    const [url, init] = fetchMock.mock.calls[0];

    expect(url).toBe("/api/login");
    expect(init.method).toBe("POST");
    expect(JSON.parse(init.body)).toEqual({
      username: "94756921275",
      password: "Password@12345",
      remember: false,
    });
  });

  it("shows an invalid-credentials message on 401 and does not redirect", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: false, status: 401 }),
    );
    render(<LoginForm />);
    fill(/username/i, "u");
    fill(/password/i, "bad");
    submit();
    expect(
      await screen.findByText("Invalid username or password."),
    ).toBeInTheDocument();
    expect(push).not.toHaveBeenCalled();
  });

  it("shows a generic error on a 500", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: false, status: 500 }),
    );
    render(<LoginForm />);
    fill(/username/i, "u");
    fill(/password/i, "p");
    submit();
    expect(
      await screen.findByText("Something went wrong. Please try again."),
    ).toBeInTheDocument();
  });

  it("shows a generic error when the request throws", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("network")));
    render(<LoginForm />);
    fill(/username/i, "u");
    fill(/password/i, "p");
    submit();
    expect(
      await screen.findByText("Something went wrong. Please try again."),
    ).toBeInTheDocument();
  });

  it("disables the button and shows a loading label while submitting", async () => {
    let resolve: (v: { ok: boolean; status: number }) => void = () => {};

    vi.stubGlobal(
      "fetch",
      vi.fn().mockReturnValue(
        new Promise((r) => {
          resolve = r;
        }),
      ),
    );
    render(<LoginForm />);
    fill(/username/i, "u");
    fill(/password/i, "p");
    submit();
    expect(await screen.findByText("Signing in...")).toBeInTheDocument();
    expect(screen.getByRole("button")).toBeDisabled();
    resolve({ ok: true, status: 200 });
    // Wait for async operations to settle so no pending state update leaks into later tests
    await waitFor(() => expect(push).toHaveBeenCalledWith("/"));
  });

  it("sends remember=true when the checkbox is checked", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue({ ok: true, status: 200, json: async () => ({}) });

    vi.stubGlobal("fetch", fetchMock);

    render(<LoginForm />);

    fireEvent.change(screen.getByLabelText(/username/i), {
      target: { value: "94756921275" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "secret" },
    });
    fireEvent.click(screen.getByLabelText(/remember me/i));
    fireEvent.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => expect(fetchMock).toHaveBeenCalled());

    const body = JSON.parse(fetchMock.mock.calls[0][1].body);

    expect(body.remember).toBe(true);
  });
});
