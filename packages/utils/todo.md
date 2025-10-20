# Main utils

## Passages schema

This should be something like Twine's passage schema, where passages can be linked to each other for visual navigation
and future AI integration.

Packages to use:
- react flow for visual navigation;
- ... (to think)

First step:
This util should have built-in script that checks user project for passages and store their schema in mermaid format (or something).
So the script should look through all files and search for ts files with passage fabrics or mdx files with passage metadata.
For each passage should be possible to add custom metadata, like tags, description, etc.

Second step:
Also the script should check game variables and see where and how they are used or changed.

Third step:
We should let user to create passages inside of this util, so the util will provide passage fabric functions.

Fourth step:
Also there should be a way to unite some groups of passages into one group and name that group.

## Migrations detection

This script should detect changes in game variables and tell user that he should make a migration of the save data.

## MCPs

This util should be able to add MCPs to the project based on what AI user wants to use.
MCP server should work with `Passage schema util` and be able to read or create passages.
