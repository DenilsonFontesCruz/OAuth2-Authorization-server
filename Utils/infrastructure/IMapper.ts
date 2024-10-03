export interface IMapper<DomainT, ModelT> {
  toDomain(model: ModelT): DomainT;
  toModel(entity: DomainT): ModelT;
}
