import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import {
  SubmenuContextProvidersProvider,
  useSubmenuContextProviders,
} from "./SubmenuContextProviders";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { IIdeMessenger, IdeMessengerContext } from "./IdeMessenger";
import React from "react";
import {
  Thread,
  ContinueRcJson,
  TerminalOptions,
  Range,
  Problem,
  IndexTag,
  ToastType,
  FileType,
  FileStatsMap,
  Location,
  RangeInFile,
} from "core";
import { GetGhTokenArgs } from "core/protocol/ide";

//console.log('IdeMessengerContext in test file:', IdeMessengerContext);

const mockSubmenuItems = [
  {
    id: "/workspace/package.json",
    title: "package.json",
    description: "llm-info/package.json",
    providerTitle: "file",
  },
  {
    id: "/workspace/fetch/package.json",
    title: "package.json",
    description: "fetch/package.json",
    providerTitle: "file",
  },
  {
    id: "/workspace/src/PosthogPageView.ts",
    title: "PosthogPageView.ts",
    description: "src/PosthogPageView.ts",
    providerTitle: "file",
  },
  {
    id: "/workspace/src/analytics.ts",
    title: "analytics.ts",
    description: "src/analytics.ts",
    providerTitle: "file",
  },
  {
    id: "/workspace/src/Settings.tsx",
    title: "Settings.tsx",
    description: "src/Settings.tsx",
    providerTitle: "file",
  },
  {
    id: "/workspace/src/SidePanel.tsx",
    title: "SidePanel.tsx",
    description: "src/SidePanel.tsx",
    providerTitle: "file",
  },
];

//console.log('mockSubmenuItems:', mockSubmenuItems);

const mockIdeMessenger: IIdeMessenger = {
  ide: {
    getOpenFiles: vi.fn().mockResolvedValue([]),
    getWorkspaceDirs: vi.fn().mockResolvedValue(["/workspace"]),
    getIdeInfo: vi.fn(),
    getIdeSettings: vi.fn(),
    getDiff: vi.fn(),
    getClipboardContent: vi.fn(),
    getCurrentFile: vi.fn(),
    isTelemetryEnabled: vi.fn(),
    getUniqueId: vi.fn(),
    getTerminalContents: vi.fn(),
    getDebugLocals: vi.fn(),
    getTopLevelCallStackSources: vi.fn(),
    getAvailableThreads: vi.fn(),
    getWorkspaceConfigs: vi.fn(),
    fileExists: vi.fn(),
    writeFile: vi.fn(),
    showVirtualFile: vi.fn(),
    openFile: vi.fn(),
    saveFile: vi.fn(),
    readFile: vi.fn(),
    readRangeInFile: vi.fn(),
    showLines: vi.fn(),
    getPinnedFiles: vi.fn(),
    getSearchResults: vi.fn(),
    subprocess: vi.fn(),
    getProblems: vi.fn(),
    getBranch: vi.fn(),
    getTags: vi.fn(),
    getRepoName: vi.fn(),
    showToast: vi.fn(),
    getGitRootPath: vi.fn(),
    listDir: vi.fn(),
    getFileStats: vi.fn(),
    getGitHubAuthToken: vi.fn(),
    readSecrets: vi.fn(),
    writeSecrets: vi.fn(),
    gotoDefinition: vi.fn(),
    onDidChangeActiveTextEditor: vi.fn(),
    openUrl: vi.fn(),
    runCommand: vi.fn(),
  },
  request: vi.fn().mockImplementation(async (method, params) => {
    if (method === "context/loadSubmenuItems") {
      return {
        status: "success",
        content: mockSubmenuItems,
      };
    }
    return { status: "error", error: "Unknown method" };
  }),
  post: vi.fn(),
  respond: vi.fn(),
  streamRequest: vi.fn(),
  llmStreamChat: vi.fn(),
};

//console.log('mockIdeMessenger:', mockIdeMessenger);

const mockStore = configureStore({
  reducer: {
    config: () => ({
      config: {
        disableIndexing: false,
        contextProviders: [
          { title: "file", type: "submenu", dependsOnIndexing: true },
        ],
      },
    }),
  },
});

//console.log('mockStore:', mockStore);

const wrapper = ({ children }: { children: React.ReactNode }) => {
  //console.log('Wrapper function called');

  return (
    <Provider store={mockStore}>
      <IdeMessengerContext.Provider value={mockIdeMessenger}>
        <SubmenuContextProvidersProvider>
          {children}
        </SubmenuContextProvidersProvider>
      </IdeMessengerContext.Provider>
    </Provider>
  );
};

describe("SubmenuContextProviders", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should load mock data", async () => {
    const requestSpy = vi.spyOn(mockIdeMessenger, "request");
    renderHook(() => useSubmenuContextProviders(), { wrapper });

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 100));
    });

    expect(requestSpy).toHaveBeenCalledWith(
      "context/loadSubmenuItems",
      expect.anything(),
    );
  });

  it("should initialize MiniSearch with mock data", async () => {
    const { result } = renderHook(() => useSubmenuContextProviders(), {
      wrapper,
    });

    // Wait until the provider sets "initialLoadComplete" true
    await act(async () => {
      await waitFor(() => {
        // Vitest's waitFor or React Testing Library's waitFor
        expect(result.current.initialLoadComplete).toBe(true);
      });
    });

    // Now query an empty string
    const items = result.current.getSubmenuContextItems("file", "");
    expect(items.length).toBe(mockSubmenuItems.length);
  });

  it("should perform exact match search", async () => {
    const { result } = renderHook(() => useSubmenuContextProviders(), {
      wrapper,
    });

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 100));
    });

    const items = result.current.getSubmenuContextItems("file", "package.json");
    expect(items.length).toBe(2);
    expect(items[0].description).toBe("llm-info/package.json");
    expect(items[1].description).toBe("fetch/package.json");
  });

  it("should perform prefix search", async () => {
    const { result } = renderHook(() => useSubmenuContextProviders(), {
      wrapper,
    });

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 100));
    });

    const items = result.current.getSubmenuContextItems("file", "Pos");
    expect(items.length).toBe(1);
    expect(items[0].title).toBe("PosthogPageView.ts");
  });

  it("should handle fuzzy matches", async () => {
    const { result } = renderHook(() => useSubmenuContextProviders(), {
      wrapper,
    });

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 100));
    });

    const items = result.current.getSubmenuContextItems("file", "pakage");
    expect(items.length).toBeGreaterThan(0);
    expect(items[0].title).toBe("package.json");
  });

  it("should prioritize prefix matches over fuzzy matches", async () => {
    const { result } = renderHook(() => useSubmenuContextProviders(), {
      wrapper,
    });

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 100));
    });

    const items = result.current.getSubmenuContextItems("file", "S");
    //console.log('Items from prioritized prefix match search:', items);
    expect(items.length).toBeGreaterThan(1);

    const topResults = items.slice(0, 2).map((item) => item.title);
    expect(topResults).toContain("Settings.tsx");
    expect(topResults).toContain("SidePanel.tsx");
  });

  it("should search in both title and description fields", async () => {
    const { result } = renderHook(() => useSubmenuContextProviders(), {
      wrapper,
    });

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 100));
    });

    const items = result.current.getSubmenuContextItems("file", "src/");
    expect(items.length).toBeGreaterThan(0);
    items.forEach((item) => {
      expect(item.description).toContain("src/");
    });
  });

  it("should handle nonexistent queries", async () => {
    const { result } = renderHook(() => useSubmenuContextProviders(), {
      wrapper,
    });

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 100));
    });

    const items = result.current.getSubmenuContextItems("file", "zzzzz");
    expect(items).toHaveLength(0);
  });

  it("should handle multiple providers if provider not specified", async () => {
    const { result } = renderHook(() => useSubmenuContextProviders(), {
      wrapper,
    });

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 100));
    });

    const items = result.current.getSubmenuContextItems(undefined, "package");
    expect(items.length).toBeGreaterThan(0);
    expect(items.some((item) => item.title === "package.json")).toBe(true);
  });
});
