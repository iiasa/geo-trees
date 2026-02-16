using Riok.Mapperly.Abstractions;
using Volo.Abp.Mapperly;
using IIASA.GeoTrees.Services.Dtos.Books;

namespace IIASA.GeoTrees.ObjectMapping;

[Mapper(RequiredMappingStrategy = RequiredMappingStrategy.Target)]
public partial class GeoTreesBlazorMappers : MapperBase<BookDto, CreateUpdateBookDto>
{
    public override partial CreateUpdateBookDto Map(BookDto source);
    public override partial void Map(BookDto source, CreateUpdateBookDto destination);
}
