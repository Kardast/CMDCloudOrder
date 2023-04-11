namespace CMDCloudOrder.Dto;

public record OrderTimeDto
{
    public int AssemblyTotal { get; set; }
    public int CuttingTotal { get; set; }
    public int PreparationTotal { get; set; }
    public int BendingTotal { get; set; }
}