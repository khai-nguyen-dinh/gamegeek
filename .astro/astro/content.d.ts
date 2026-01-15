declare module 'astro:content' {
	interface RenderResult {
		Content: import('astro/runtime/server/index.js').AstroComponentFactory;
		headings: import('astro').MarkdownHeading[];
		remarkPluginFrontmatter: Record<string, any>;
	}
	interface Render {
		'.md': Promise<RenderResult>;
	}

	export interface RenderedContent {
		html: string;
		metadata?: {
			imagePaths: Array<string>;
			[key: string]: unknown;
		};
	}
}

declare module 'astro:content' {
	type Flatten<T> = T extends { [K: string]: infer U } ? U : never;

	export type CollectionKey = keyof AnyEntryMap;
	export type CollectionEntry<C extends CollectionKey> = Flatten<AnyEntryMap[C]>;

	export type ContentCollectionKey = keyof ContentEntryMap;
	export type DataCollectionKey = keyof DataEntryMap;

	type AllValuesOf<T> = T extends any ? T[keyof T] : never;
	type ValidContentEntrySlug<C extends keyof ContentEntryMap> = AllValuesOf<
		ContentEntryMap[C]
	>['slug'];

	/** @deprecated Use `getEntry` instead. */
	export function getEntryBySlug<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(
		collection: C,
		// Note that this has to accept a regular string too, for SSR
		entrySlug: E,
	): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;

	/** @deprecated Use `getEntry` instead. */
	export function getDataEntryById<C extends keyof DataEntryMap, E extends keyof DataEntryMap[C]>(
		collection: C,
		entryId: E,
	): Promise<CollectionEntry<C>>;

	export function getCollection<C extends keyof AnyEntryMap, E extends CollectionEntry<C>>(
		collection: C,
		filter?: (entry: CollectionEntry<C>) => entry is E,
	): Promise<E[]>;
	export function getCollection<C extends keyof AnyEntryMap>(
		collection: C,
		filter?: (entry: CollectionEntry<C>) => unknown,
	): Promise<CollectionEntry<C>[]>;

	export function getEntry<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(entry: {
		collection: C;
		slug: E;
	}): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof DataEntryMap,
		E extends keyof DataEntryMap[C] | (string & {}),
	>(entry: {
		collection: C;
		id: E;
	}): E extends keyof DataEntryMap[C]
		? Promise<DataEntryMap[C][E]>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(
		collection: C,
		slug: E,
	): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof DataEntryMap,
		E extends keyof DataEntryMap[C] | (string & {}),
	>(
		collection: C,
		id: E,
	): E extends keyof DataEntryMap[C]
		? Promise<DataEntryMap[C][E]>
		: Promise<CollectionEntry<C> | undefined>;

	/** Resolve an array of entry references from the same collection */
	export function getEntries<C extends keyof ContentEntryMap>(
		entries: {
			collection: C;
			slug: ValidContentEntrySlug<C>;
		}[],
	): Promise<CollectionEntry<C>[]>;
	export function getEntries<C extends keyof DataEntryMap>(
		entries: {
			collection: C;
			id: keyof DataEntryMap[C];
		}[],
	): Promise<CollectionEntry<C>[]>;

	export function render<C extends keyof AnyEntryMap>(
		entry: AnyEntryMap[C][string],
	): Promise<RenderResult>;

	export function reference<C extends keyof AnyEntryMap>(
		collection: C,
	): import('astro/zod').ZodEffects<
		import('astro/zod').ZodString,
		C extends keyof ContentEntryMap
			? {
					collection: C;
					slug: ValidContentEntrySlug<C>;
				}
			: {
					collection: C;
					id: keyof DataEntryMap[C];
				}
	>;
	// Allow generic `string` to avoid excessive type errors in the config
	// if `dev` is not running to update as you edit.
	// Invalid collection names will be caught at build time.
	export function reference<C extends string>(
		collection: C,
	): import('astro/zod').ZodEffects<import('astro/zod').ZodString, never>;

	type ReturnTypeOrOriginal<T> = T extends (...args: any[]) => infer R ? R : T;
	type InferEntrySchema<C extends keyof AnyEntryMap> = import('astro/zod').infer<
		ReturnTypeOrOriginal<Required<ContentConfig['collections'][C]>['schema']>
	>;

	type ContentEntryMap = {
		"categories": {
"app-development.md": {
	id: "app-development.md";
  slug: "app-development";
  body: string;
  collection: "categories";
  data: any
} & { render(): Render[".md"] };
"cyber-security.md": {
	id: "cyber-security.md";
  slug: "cyber-security";
  body: string;
  collection: "categories";
  data: any
} & { render(): Render[".md"] };
"database-security.md": {
	id: "database-security.md";
  slug: "database-security";
  body: string;
  collection: "categories";
  data: any
} & { render(): Render[".md"] };
"it-consultancy.md": {
	id: "it-consultancy.md";
  slug: "it-consultancy";
  body: string;
  collection: "categories";
  data: any
} & { render(): Render[".md"] };
"it-services.md": {
	id: "it-services.md";
  slug: "it-services";
  body: string;
  collection: "categories";
  data: any
} & { render(): Render[".md"] };
"ui-ux-design.md": {
	id: "ui-ux-design.md";
  slug: "ui-ux-design";
  body: string;
  collection: "categories";
  data: any
} & { render(): Render[".md"] };
"vietnam-game-scene.md": {
	id: "vietnam-game-scene.md";
  slug: "vietnam-game-scene";
  body: string;
  collection: "categories";
  data: any
} & { render(): Render[".md"] };
};
"posts": {
"building-scalable-react-applications.md": {
	id: "building-scalable-react-applications.md";
  slug: "building-scalable-react-applications";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"cross-platform-flutter-development.md": {
	id: "cross-platform-flutter-development.md";
  slug: "cross-platform-flutter-development";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"cyber-security-threats-and-solutions.md": {
	id: "cyber-security-threats-and-solutions.md";
  slug: "cyber-security-threats-and-solutions";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"database-security-best-practices-2025.md": {
	id: "database-security-best-practices-2025.md";
  slug: "database-security-best-practices-2025";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"future-of-web-development-2025.md": {
	id: "future-of-web-development-2025.md";
  slug: "future-of-web-development-2025";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"it-consultancy-strategic-approaches.md": {
	id: "it-consultancy-strategic-approaches.md";
  slug: "it-consultancy-strategic-approaches";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"modern-ui-ux-design-principles.md": {
	id: "modern-ui-ux-design-principles.md";
  slug: "modern-ui-ux-design-principles";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"vietnam-has-topped-the-world-in-mobile-game-exports-momentum-peaks-at-vietnam-game-connect-2025.md": {
	id: "vietnam-has-topped-the-world-in-mobile-game-exports-momentum-peaks-at-vietnam-game-connect-2025.md";
  slug: "vietnam-has-topped-the-world-in-mobile-game-exports-momentum-peaks-at-vietnam-game-connect-2025";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
};
"slides": {
"slide-2.md": {
	id: "slide-2.md";
  slug: "slide-2";
  body: string;
  collection: "slides";
  data: any
} & { render(): Render[".md"] };
"slide-3.md": {
	id: "slide-3.md";
  slug: "slide-3";
  body: string;
  collection: "slides";
  data: any
} & { render(): Render[".md"] };
"the-gaming-central-hub-of-vietnam.md": {
	id: "the-gaming-central-hub-of-vietnam.md";
  slug: "the-gaming-central-hub-of-vietnam";
  body: string;
  collection: "slides";
  data: any
} & { render(): Render[".md"] };
};

	};

	type DataEntryMap = {
		"events": Record<string, {
  id: string;
  collection: "events";
  data: any;
}>;
"pages": Record<string, {
  id: string;
  collection: "pages";
  data: any;
}>;
"services": Record<string, {
  id: string;
  collection: "services";
  data: any;
}>;
"team": Record<string, {
  id: string;
  collection: "team";
  data: any;
}>;

	};

	type AnyEntryMap = ContentEntryMap & DataEntryMap;

	export type ContentConfig = never;
}
