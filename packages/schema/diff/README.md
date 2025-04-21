PS C:\ds\workspace\node\js\graphql-schema-utils\packages\schema\compose> npx graphql-inspector diff http://localhost:4006/graphql  http://localhost:4007/graphql --format markdown

    (node:25688) [DEP0040] DeprecationWarning: The `punycode` module is deprecated. Please use a userland alternative instead.
    (Use `node --trace-deprecation ...` to show where the warning was created)
    success No changes detected

PS C:\ds\workspace\node\js\graphql-schema-utils\packages\schema\compose> npx graphql-inspector diff http://localhost:4000/graphql  http://localhost:4001/graphql --format markdown

    (node:35324) [DEP0040] DeprecationWarning: The `punycode` module is deprecated. Please use a userland alternative instead.
    (Use `node --trace-deprecation ...` to show where the warning was created)
    Detected the following changes (14) between schemas:
    ×  Type Product was removed
    ×  Field topProducts was removed from object type Query
    √  Directive extends was added
    √  Directive external was added
    √  Directive key was added
    √  Directive provides was added
    √  Directive requires was added
    √  Directive tag was added
    √  Field _entities was added to object type Query
    √  Field _service was added to object type Query
    √  Type _Any was added
    √  Type _Entity was added
    √  Type _FieldSet was added
    √  Type _Service was added
    error Detected 2 breaking changes


PS C:\ds\workspace\node\js\graphql-schema-utils> npx graphql-inspector diff http://localhost:4001/graphql  http://localhost:4002/graphql --format markdown

    (node:26760) [DEP0040] DeprecationWarning: The `punycode` module is deprecated. Please use a userland alternative instead.
    (Use `node --trace-deprecation ...` to show where the warning was created)
    Detected the following changes (6) between schemas:
    ×  Type Account was removed
    ×  Field me was removed from object type Query
    ×  Member Account was removed from Union type _Entity
    ‼  Member Product was added to Union type _Entity
    √  Type Product was added
    √  Field topProducts was added to object type Query
    error Detected 3 breaking changes