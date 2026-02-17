---
title: "StreamJsonRpc 在 HagiCode 中的深度集成与实践"
date: 2026-01-28
truncate: true
englishSlug: "streamjsonrpc-integration-in-hagicode"
---

# StreamJsonRpc 在 HagiCode 中的深度集成与实践

> 本文详细介绍了 HagiCode（原 PCode）项目如何成功集成 Microsoft 的 StreamJsonRpc 通信库，以替换原有的自定义 JSON-RPC 实现，并解决了集成过程中的技术痛点与架构挑战。

## 背景

StreamJsonRpc 是微软官方维护的用于 .NET 和 TypeScript 的 JSON-RPC 通信库，以其强大的类型安全、自动代理生成和成熟的异常处理机制著称。在 HagiCode 项目中，为了通过 ACP (Agent Communication Protocol) 与外部 AI 工具（如 iflow CLI、OpenCode CLI）进行通信，并消除早期自定义 JSON-RPC 实现带来的维护成本和潜在 Bug，项目决定集成 StreamJsonRpc。然而，在集成过程中遇到了流式 JSON-RPC 特有的挑战，特别是在处理代理目标绑定和泛型参数识别时。

为了解决这些痛点，我们做了一个大胆的决定：整个构建系统推倒重来。这个决定带来的变化，可能比你想象的还要大——稍后我会具体说。

## 关于 HagiCode

> 先介绍一下本文的"主角项目"

如果你在开发中遇到过这些烦恼：
- 多项目、多技术栈，构建脚本维护成本高
- CI/CD 流水线配置繁琐，每次改都要查文档
- 跨平台兼容性问题层出不穷
- 想让 AI 帮忙写代码，但现有工具不够智能

那么我们正在做的 HagiCode 可能你会感兴趣。

**HagiCode 是什么？**
- 一款 AI 驱动的代码智能助手
- 支持多语言、跨平台的代码生成与优化
- 内置游戏化机制，让编码不再枯燥

**为什么在这里提它？**
本文分享的 StreamJsonRpc 集成方案，正是我们在开发 HagiCode 过程中实践总结出来的。如果你觉得这套工程化方案有价值，说明我们的技术品味还不错——那么 HagiCode 本身也值得关注一下。

**想了解更多？**
- GitHub: [github.com/HagiCode-org/site](https://github.com/HagiCode-org/site)（求 Star）
- 官网: [hagicode.com](https://hagicode.com)
- 视频演示: [www.bilibili.com/video/BV1pirZBuEzq/](https://www.bilibili.com/video/BV1pirZBuEzq/)（30 分钟实战演示）
- 安装指南: [hagicode.com/installation/docker-compose](https://hagicode.com/installation/docker-compose)
- 公测已开始：现在安装即可参与公测

## 分析

当前项目处于 ACP 协议集成的关键阶段，面临着以下几个技术痛点和架构挑战：

### 1. 自定义实现的局限
原有的 JSON-RPC 实现位于 `src/HagiCode.ClaudeHelper/AcpImp/`，包含 `JsonRpcEndpoint` 和 `ClientSideConnection` 等组件。维护这套自定义代码成本高，且缺乏成熟库的高级功能（如进度报告、取消支持）。

### 2. StreamJsonRpc 集成障碍
在尝试将现有的 `CallbackProxyTarget` 模式迁移到 StreamJsonRpc 时，发现 `_rpc.AddLocalRpcTarget(target)` 方法无法识别通过代理模式创建的目标。具体表现为，StreamJsonRpc 无法自动将泛型类型 `T` 的属性拆分为 RPC 方法参数，导致服务器端无法正确处理客户端发起的方法调用。

### 3. 架构分层混乱
现有的 `ClientSideConnection` 混合了传输层（WebSocket/Stdio）、协议层（JSON-RPC）和业务层（ACP Agent 接口），导致职责不清，且存在 `AcpAgentCallbackRpcAdapter` 方法绑定缺失的问题。

### 4. 日志缺失
WebSocket 传输层缺少对原始 JSON 内容的日志输出，导致在调试 RPC 通信问题时难以定位是序列化问题还是网络问题。

## 解决

针对上述问题，我们采用了以下系统化的解决方案，从架构重构、库集成和调试增强三个维度进行优化：

### 1. 全面迁移至 StreamJsonRpc

#### 移除旧代码
删除 `JsonRpcEndpoint.cs`、`AgentSideConnection.cs` 及相关的自定义序列化转换器（`JsonRpcMessageJsonConverter` 等）。

#### 集成官方库
引入 `StreamJsonRpc` NuGet 包，利用其 `JsonRpc` 类处理核心通信逻辑。

#### 抽象传输层
定义 `IAcpTransport` 接口，统一处理 `WebSocket` 和 `Stdio` 两种传输模式，确保协议层与传输层解耦。

```csharp
// IAcpTransport 接口定义
public interface IAcpTransport
{
    Task SendAsync(string message, CancellationToken cancellationToken = default);
    Task<string> ReceiveAsync(CancellationToken cancellationToken = default);
    Task CloseAsync(CancellationToken cancellationToken = default);
}

// WebSocket 传输实现
public class WebSocketTransport : IAcpTransport
{
    private readonly WebSocket _webSocket;

    public WebSocketTransport(WebSocket webSocket)
    {
        _webSocket = webSocket;
    }

    // 实现发送和接收方法
    // ...
}

// Stdio 传输实现
public class StdioTransport : IAcpTransport
{
    private readonly StreamReader _reader;
    private readonly StreamWriter _writer;

    public StdioTransport(StreamReader reader, StreamWriter writer)
    {
        _reader = reader;
        _writer = writer;
    }

    // 实现发送和接收方法
    // ...
}
```

### 2. 修复代理目标识别问题

#### 分析 `CallbackProxyTarget`
检查现有的动态代理生成逻辑，确定 StreamJsonRpc 无法识别的根本原因（通常是因为代理对象没有公开实际的方法签名，或者使用了 StreamJsonRpc 不支持的参数类型）。

#### 重构参数传递
将泛型属性拆分为明确的 RPC 方法参数。不再依赖动态属性，而是定义具体的 Request/Response DTO（数据传输对象），确保 StreamJsonRpc 能通过反射正确识别方法签名。

```csharp
// 原有的泛型属性方式
public class CallbackProxyTarget<T>
{
    public Func<T, Task> Callback { get; set; }
}

// 重构后的具体方法方式
public class ReadTextFileRequest
{
    public string FilePath { get; set; }
}

public class ReadTextFileResponse
{
    public string Content { get; set; }
}

public interface IAcpAgentCallback
{
    Task<ReadTextFileResponse> ReadTextFileAsync(ReadTextFileRequest request);
    // 其他方法...
}
```

#### 使用 `Attach` 替代 `AddLocalRpcTarget`
在某些复杂场景下，手动代理 `JsonRpc` 对象并处理 `RpcConnection` 可能比直接添加目标更灵活。

### 3. 实现方法绑定与日志增强

#### 实现 `AcpAgentCallbackRpcAdapter`
确保该组件显式实现 StreamJsonRpc 的代理接口，将 ACP 协议定义的方法（如 `ReadTextFileAsync`）映射到 StreamJsonRpc 的回调处理器上。

#### 集成日志记录
在 WebSocket 或 Stdio 的消息处理管道中，拦截并记录 JSON-RPC 请求和响应的原始文本。利用 `ILogger` 在解析前和序列化后输出原始 payload，以便排查格式错误。

```csharp
// 日志增强的传输包装器
public class LoggingAcpTransport : IAcpTransport
{
    private readonly IAcpTransport _innerTransport;
    private readonly ILogger<LoggingAcpTransport> _logger;

    public LoggingAcpTransport(IAcpTransport innerTransport, ILogger<LoggingAcpTransport> logger)
    {
        _innerTransport = innerTransport;
        _logger = logger;
    }

    public async Task SendAsync(string message, CancellationToken cancellationToken = default)
    {
        _logger.LogTrace("Sending message: {Message}", message);
        await _innerTransport.SendAsync(message, cancellationToken);
    }

    public async Task<string> ReceiveAsync(CancellationToken cancellationToken = default)
    {
        var message = await _innerTransport.ReceiveAsync(cancellationToken);
        _logger.LogTrace("Received message: {Message}", message);
        return message;
    }

    public async Task CloseAsync(CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Closing connection");
        await _innerTransport.CloseAsync(cancellationToken);
    }
}
```

### 4. 架构分层重构

#### 传输层 (`AcpRpcClient`)
封装 StreamJsonRpc 连接，负责 `InvokeAsync` 和连接生命周期管理。

```csharp
public class AcpRpcClient : IDisposable
{
    private readonly JsonRpc _rpc;
    private readonly IAcpTransport _transport;

    public AcpRpcClient(IAcpTransport transport)
    {
        _transport = transport;
        _rpc = new JsonRpc(new StreamRpcTransport(transport));
        _rpc.StartListening();
    }

    public async Task<TResponse> InvokeAsync<TResponse>(string methodName, object parameters)
    {
        return await _rpc.InvokeAsync<TResponse>(methodName, parameters);
    }

    public void Dispose()
    {
        _rpc.Dispose();
        _transport.Dispose();
    }

    // StreamRpcTransport 是对 IAcpTransport 的 StreamJsonRpc 适配器
    private class StreamRpcTransport : IDuplexPipe
    {
        // 实现 IDuplexPipe 接口
        // ...
    }
}
```

#### 协议层 (`IAcpAgentClient` / `IAcpAgentCallback`)
定义清晰的 client-to-agent 和 agent-to-client 接口，移除 `Func<IAcpAgent, IAcpClient>` 这种循环依赖的工厂模式，改用依赖注入或直接注册回调。

## 实践

基于 StreamJsonRpc 的最佳实践和项目经验，以下是实施过程中的关键建议：

### 1. 强类型 DTO 优于动态对象
StreamJsonRpc 的核心优势在于强类型。不要使用 `dynamic` 或 `JObject` 传递参数。应为每个 RPC 方法定义明确的 C# POCO 类作为参数。这不仅解决了代理目标识别问题，还能在编译时发现类型错误。

示例：将 `CallbackProxyTarget` 中的泛型属性替换为 `ReadTextFileRequest` 和 `WriteTextFileRequest` 等具体类。

### 2. 显式声明 Method Name
使用 `[JsonRpcMethod]` 特性显式指定 RPC 方法名称，不要依赖默认的方法名映射。这可以防止因命名风格差异（如 PascalCase vs camelCase）导致的调用失败。

```csharp
public interface IAcpAgentCallback
{
    [JsonRpcMethod("readTextFile")]
    Task<ReadTextFileResponse> ReadTextFileAsync(ReadTextFileRequest request);
    
    [JsonRpcMethod("writeTextFile")]
    Task WriteTextFileAsync(WriteTextFileRequest request);
}
```

### 3. 利用连接状态回调
StreamJsonRpc 提供了 `JsonRpc.ConnectionLost` 事件。务必监听此事件以处理进程意外退出或网络断开的情况，这比单纯依赖 Orleans 的 Grain 失效检测更及时。

```csharp
_rpc.ConnectionLost += (sender, e) =>
{
    _logger.LogError("RPC connection lost: {Reason}", e.ToString());
    // 处理重连逻辑或通知用户
};
```

### 4. 日志分层记录
- **Trace 级别**：记录完整的 JSON Request/Response 原文。
- **Debug 级别**：记录方法调用栈和参数摘要。
- **注意**：确保日志中不包含敏感的 Authorization Token 或大文件内容的 Base64 编码。

### 5. 处理流式传输的特殊性
StreamJsonRpc 原生支持 `IAsyncEnumerable`。在实现 ACP 的流式 Prompt 响应时，应直接使用 `IAsyncEnumerable` 而不是自定义的分页逻辑。这能极大简化流式处理的代码量。

```csharp
public interface IAcpAgentCallback
{
    [JsonRpcMethod("streamText")]
    IAsyncEnumerable<string> StreamTextAsync(StreamTextRequest request);
}
```

### 6. 适配器模式 (Adapter Pattern)
保持 `ACPSession` 和 `ClientSideConnection` 的分离。`ACPSession` 应专注于 Orleans 的状态管理和业务逻辑（如消息入队），通过组合而非继承的方式使用 StreamJsonRpc 连接对象。

## 总结

通过全面集成 StreamJsonRpc，HagiCode 项目成功解决了原自定义实现的维护成本高、功能局限性和架构分层混乱等问题。关键改进包括：

1. 采用强类型 DTO 替代动态属性，提高了代码的可维护性和可靠性
2. 实现了传输层抽象和协议层分离，提升了架构的清晰性
3. 增强了日志记录功能，便于排查通信问题
4. 引入了流式传输支持，简化了流式处理的实现

这些改进为 HagiCode 提供了更稳定、更高效的通信基础，使其能够更好地与外部 AI 工具进行交互，并为未来的功能扩展奠定了坚实的基础。

## 参考资料

- StreamJsonRpc 官方文档：[https://learn.microsoft.com/en-us/dotnet/api/microsoft.visualstudio.threading.streamjsonrpc](https://learn.microsoft.com/en-us/dotnet/api/microsoft.visualstudio.threading.streamjsonrpc)
- ACP (Agent Communication Protocol) 规范：[https://github.com/microsoft/agentcommunicationprotocol](https://github.com/microsoft/agentcommunicationprotocol)
- HagiCode 项目：[https://github.com/HagiCode-org/site](https://github.com/HagiCode-org/site)
- Orleans 官方文档：[https://learn.microsoft.com/en-us/dotnet/orleans](https://learn.microsoft.com/en-us/dotnet/orleans)

---

如果本文对你有帮助：
- 点个赞让更多人看到
- 来 GitHub 给个 Star：[github.com/HagiCode-org/site](https://github.com/HagiCode-org/site)
- 访问官网了解更多：[hagicode.com](https://hagicode.com)
- 观看 30 分钟实战演示：[www.bilibili.com/video/BV1pirZBuEzq/](https://www.bilibili.com/video/BV1pirZBuEzq/)
- 一键安装体验：[hagicode.com/installation/docker-compose](https://hagicode.com/installation/docker-compose)
- 公测已开始，欢迎安装体验



---

感谢您的阅读,如果您觉得本文有用,快点击下方点赞按钮👍,让更多的人看到本文。

本内容采用人工智能辅助协作,经本人审核,符合本人观点与立场。

- **本文作者:** [newbe36524](https://www.newbe.pro)
- **本文链接:** [https://hagicode.com/blog/2026/01/28/streamjsonrpc-integration-in-hagicode](https://hagicode.com/blog/2026/01/28/streamjsonrpc-integration-in-hagicode)
- **版权声明:** 本博客所有文章除特别声明外,均采用 BY-NC-SA 许可协议。转载请注明出处!