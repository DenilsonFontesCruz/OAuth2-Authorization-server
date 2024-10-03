export abstract class ValueObject<PropsT> {
  public props: PropsT;

  constructor(props: PropsT) {
    this.props = props;
  }

  public equals(valueObject?: ValueObject<PropsT>): boolean {
    if (
      valueObject === null ||
      valueObject === undefined ||
      valueObject.props === undefined
    ) {
      return false;
    }

    return JSON.stringify(this.props) === JSON.stringify(valueObject.props);
  }
}
