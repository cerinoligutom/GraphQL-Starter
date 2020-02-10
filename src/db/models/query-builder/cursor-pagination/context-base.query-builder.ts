// tslint:disable:no-any
import { Model, QueryBuilder } from 'objection';

export class ContextBase<M extends Model, R = M[]> extends QueryBuilder<M, R> {
  protected $flag(key: string, value?: any) {
    return this.setContext('__cursor_flag_', key, value);
  }

  protected $data<T = this>(key: string, value?: any) {
    return this.setContext<T>('__cursor_data_', key, value) as T;
  }

  // tslint:disable-next-line: ban-types
  protected lockStatement(builder: this, flag: string, fn: Function) {
    if (builder.$flag(flag)) {
      return builder;
    }

    builder.$flag(flag, true);
    fn();
    builder.$flag(flag, false);
    return builder;
  }

  private setContext<T = this>(prefix: string, key: string, value?: any) {
    const contextKey = `${prefix}${key}`;

    if (value !== undefined) {
      this.context({
        [contextKey]: value,
      });

      return this;
    }

    return this.context()[contextKey] as T;
  }
}
