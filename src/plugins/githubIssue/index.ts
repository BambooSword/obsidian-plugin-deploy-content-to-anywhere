import { Editor, MarkdownView, Notice } from "obsidian";
import { MyPlugin } from "../../MyPlugin";
import { SettingTab } from "./SettingTab";
import { submitDaily } from "./submitDaily";
import { submitDailyToUncleRan } from './submitDailyToUncleRan'
import { submitReadme } from './submitReadme'

// TODO
// 1. 定义默认的值
// 2. 插件的名称
// 3. 插件的执行函数

export function githubIssue(main: MyPlugin) {
  // 添加命令
  main.addCommand({
    id: "obsidian-plugin-deploy-content-to-anywhere:command:deploy",
    name: "Deploy To Github Issue",
    editorCallback: async (editor: Editor, view: MarkdownView) => {
      console.log(view.data);
      console.log(main.settings);

      try {
        await submitDaily({
          content: view.data,
          githubToken: main.settings.githubIssue.token,
          owner: main.settings.githubIssue.owner,
          repo: main.settings.githubIssue.repo,
        });

        new Notice("提交成功");
        console.log("提交成功");
      } catch (error: any) {
        new Notice(`提交失败: ${error.message}}`);
        console.log("提交失败", error);
      }
    },
  });
  main.addCommand({
    id: "obsidian-plugin-deploy-content-to-anywhere:command:deploy-uncle-ran",
    name: "Deploy To UncleRan's DayDayUp Issue plan",
    editorCallback: async (editor: Editor, view: MarkdownView) => {
      console.log(view.data);
      console.log(main.settings);

      try {
        await submitDailyToUncleRan({
          content: view.data,
          githubToken: main.settings.githubIssue.token,
          owner: main.settings.githubIssue.owner,
          repo: main.settings.githubIssue.repo,
        })

        new Notice("提交成功");
        console.log("提交成功");
      } catch (error: any) {
        new Notice(`提交失败: ${error.message}}`);
        console.log("提交失败", error);
      }
    },
  });
  main.addCommand({
    id: "obsidian-plugin-deploy-content-to-anywhere:command:deploy-readme",
    name: "Deploy To Github README",
    editorCallback: async (editor: Editor, view: MarkdownView) => {
      console.log(view.data);
      console.log(main.settings);

      try {
        await submitReadme({
          content: view.data,
          githubToken: main.settings.githubIssue.token,
          owner: main.settings.githubIssue.owner,
          repo: main.settings.githubIssue.repo,
        })

        new Notice("提交成功~");
        console.log("提交成功~");
      } catch (error: any) {
        new Notice(`提交失败: ${error.message}}`);
        console.log("提交失败", error);
      }
    },
  });

  // 添加 setting 面板的 view
  main.addSettingTab(new SettingTab(main.app, main));
}

export const defaultSettings = {
  token: "",
  owner: "",
  repo: "",
};
