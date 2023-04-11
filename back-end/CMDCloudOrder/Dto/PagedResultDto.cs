namespace CMDCloudOrder.Dto;

public record PagedResultDto<T>(T[] Items, int TotalCount);