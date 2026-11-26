import type {
  Categoria,
  Instrumento,
  PaginatedServiceResponse,
  ProductImage,
  ServiceResponse,
} from "../types/Instrumento"

export interface InstrumentoService {
  getAll(
    page?: number,
    size?: number,
    sort?: string,
  ): Promise<PaginatedServiceResponse<Instrumento>>
  getAllSimple(): Promise<PaginatedServiceResponse<Instrumento>>
  getById(id: number): Promise<ServiceResponse<Instrumento>>
  create(instrumento: unknown): Promise<ServiceResponse<Instrumento>>
  update(
    id: number,
    instrumento: unknown,
  ): Promise<ServiceResponse<Instrumento>>
  delete(id: number): Promise<ServiceResponse<null>>
  getByCategoria(
    categoriaId: number,
  ): Promise<PaginatedServiceResponse<Instrumento>>
  search(nombre: string): Promise<PaginatedServiceResponse<Instrumento>>
}

export interface CategoriaService {
  getAll(): Promise<ServiceResponse<Categoria[]>>
  getById(id: number): Promise<ServiceResponse<Categoria>>
  create(categoria: { denominacion: string }): Promise<ServiceResponse<Categoria>>
  update(
    id: number,
    categoria: { denominacion: string },
  ): Promise<ServiceResponse<Categoria>>
  delete(id: number): Promise<ServiceResponse<null>>
}

export interface ImageService {
  upload(
    instrumentoId: number,
    file: File,
    altText?: string,
    isPrimary?: boolean,
  ): Promise<ServiceResponse<ProductImage>>
  getByInstrumento(
    instrumentoId: number,
  ): Promise<ServiceResponse<ProductImage[]>>
  getPrimary(instrumentoId: number): Promise<ServiceResponse<ProductImage>>
  delete(imageId: number): Promise<ServiceResponse<null>>
  setPrimary(imageId: number): Promise<ServiceResponse<ProductImage>>
  getImageUrl(filename: string): string
}

export interface DataBackend {
  instrumentoService: InstrumentoService
  categoriaService: CategoriaService
  imageService: ImageService
}
