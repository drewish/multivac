---
layout: post
title: String Sorting in Elasticsearch
---
At Recurly I'd spent some time working on a project to convert pages listing  listing
pages from MySQL dirven

I'd naively thought that string sorting would work the same way as in MySQL. It
does not, and like most things in Elasticsearch the answer involves a [custom analyzer](http://www.elasticsearch.org/guide/en/elasticsearch/reference/current/analysis-custom-analyzer.html).

I'll spoil the surprise and just give you the answer. You write a custom
analyzer that puts a field's values into a sortable format:

```json
{
  "analyzer": {
    "sortable": {
      "type": "custom",
      "tokenizer": "keyword",
      "filter": [
        "lowercase",
        "trim"
      ]
    }
  }
}
```

With the suprise ruined let's dig into it and look at how the various pieces
work together.

To provide a little context for this, analyzers work by splitting a string up
into tokens and then applying filters to each token.

The [keyword tokenizer](http://www.elasticsearch.org/guide/en/elasticsearch/reference/current/analysis-keyword-analyzer.html)
creates a single token for the entire value in the field rather than splitting
it up into multiple tokens. If a field has multiple tokens you don't have
control over which will be used for sorting. Well that's not 100% true, you
could specify a [sort mode](http://www.elasticsearch.org/guide/en/elasticsearch/reference/current/search-request-sort.html#_sort_mode_option)
but then you're picking the min or max token which may not be at the beginning
of the string.

We don't want case sensitive sorting so using the [lowercase filter](http://www.elasticsearch.org/guide/en/elasticsearch/reference/current/analysis-lowercase-tokenfilter.html#analysis-lowercase-tokenfilter)
turns `Foo` into `foo` meaning `foo 1` would sort ahead of `Foo 2`.

Unlike many tokenizers the keyword tokenizer preserves whitespace. When you
combine this with HTML, which tends to hide leading whitespace, you'll get an
odd behavior: someone who entered their name as ` John` will sort ahead of
`Adam` and since the space isn't visible, it'll look like the sort is incorrect.
So we use the [trim filter](http://www.elasticsearch.org/guide/en/elasticsearch/reference/current/analysis-trim-tokenfilter.html#analysis-trim-tokenfilter)
to remove the leading (and trailing) whitespace and give a visually correct
sort.

Little side note this sortable analyzer actually works great for doing exact
matches and autocompletes.

Now let's look at how you'd use it. The field is made sortable by specifying
the analyzer in the mapping. This basically requires the field just be used for
sorting (or exact matches) and since you typically also want to search on the
field we can group the two versions in one field. You can group the sortable
versions of a value in what used to be a separate [multi_field type](http://www.elasticsearch.org/guide/en/elasticsearch/reference/0.90/mapping-multi-field-type.html)s
but are now just [fields](http://www.elasticsearch.org/guide/en/elasticsearch/reference/current/mapping-core-types.html#_multi_fields_3):

```json
{
  "user": {
    "properties": {
      "name": {
        "type": "string",
        "analyzer": "standard"
        "fields": {
          "sort": {
            "type": "string",
            "analyzer": "sortable"
          }
        }
      },
      "deleted_at": { "type": "date" }
    }
  }
}
```

To use the new field for sorting you just use a period to join the names, e.g.
`name.sort`:

```json
{
  "sort": [
    { "name.sort": "desc" },
  ],
  "query": {
    "missing": { "field": "deleted_at" }
  }
}
```

