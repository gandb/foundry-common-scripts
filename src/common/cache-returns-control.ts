export class CacheReturnControl<K, V>{

    private readonly _cache: Map<number, V> = new Map();
    private readonly _indexKey: Map<K, number> = new Map();
    private _firstIndex: number = 0;
    private _nextIndex: number = 0;

    public constructor(private readonly capacity: number = 1000) {

    }

    public add(key: K, value: V): void {

        if (this._indexKey.has(key)) {
            throw new Error("Key " + key + " alread exist");
        }

        this._indexKey.set(key, this._nextIndex);
        this._cache.set(this._nextIndex++, value);

        if (this._cache.size > this.capacity) {
            this._cache.delete(this._firstIndex++);
        }

        const indexCacheIs2TimesMoreThenCapacity: boolean = this._indexKey.size > (this.capacity * 2);
        if (indexCacheIs2TimesMoreThenCapacity) {
            this.cleanCacheLazy();

        }
    }

    public has(key: K): boolean {
        return this._indexKey.has(key);
    }



    public get(key: K): V {
        if (!this._indexKey.has(key)) {
            throw new Error("Key " + key + " not exist any more");
        }
        const index: number = this._indexKey.get(key) as number;
        return this._cache.get(index) as V;
    }


    private cleanCacheLazy() {
        const keysToRemove: Array<K> = [];

        for (const key of this._indexKey.keys()) {
            const index: number = this._indexKey.get(key) as number;
            if (index < this._firstIndex) {
                keysToRemove.push(key);
            }
        }

        for (const element of keysToRemove) {
            const key: K = element;
            this._indexKey.delete(key);
        }
    }
}