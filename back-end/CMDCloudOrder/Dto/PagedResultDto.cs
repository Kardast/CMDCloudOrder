namespace CMDCloudOrder.Cqrs.Queries;

public record PagedResultDto<T>(T[] Items, int TotalCount);