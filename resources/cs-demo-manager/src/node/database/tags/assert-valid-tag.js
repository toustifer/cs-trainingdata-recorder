import { InvalidTagColor } from './errors/invalid-tag-color';
import { TagNameTooLong } from './errors/tag-name-too-long';
import { TagNameTooShort } from './errors/tag-name-too-short';
function assertHexColor(hex) {
    const regexp = new RegExp(/^#[\dA-F]{6}$/);
    if (!regexp.test(hex.toUpperCase())) {
        throw new InvalidTagColor();
    }
}
function assertTagLength(tagName) {
    if (tagName.length === 0) {
        throw new TagNameTooShort();
    }
    if (tagName.length > 40) {
        throw new TagNameTooLong();
    }
}
export function assertValidTag(tag) {
    assertTagLength(tag.name);
    assertHexColor(tag.color);
}
//# sourceMappingURL=assert-valid-tag.js.map