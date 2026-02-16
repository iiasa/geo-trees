using System;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Application.Services;
using IIASA.GeoTrees.Services.Dtos.Books;
using IIASA.GeoTrees.Entities.Books;

namespace IIASA.GeoTrees.Services.Books;

public interface IBookAppService :
    ICrudAppService< //Defines CRUD methods
        BookDto, //Used to show books
        Guid, //Primary key of the book entity
        PagedAndSortedResultRequestDto, //Used for paging/sorting
        CreateUpdateBookDto> //Used to create/update a book
{

}