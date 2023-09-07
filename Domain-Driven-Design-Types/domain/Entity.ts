import { Identifier } from '../Generics';

export abstract class Entity<PropsT> {
  protected readonly _id: Identifier;
  public readonly props: PropsT;

  constructor(props: PropsT, _id: Identifier) {
    this._id = _id;
    this.props = props;
  }

  public equals(entity?: Entity<PropsT>): boolean {
    if (entity == null || entity == undefined) {
      return false;
    }

    if (this === entity) {
      return true;
    }

    return this._id == entity._id;
  }
}
