import moment from "moment";

export function serializeDateOnly(value: string | null): string | null {
    if (!value) {
        return null;
    }

    return moment(value).format('YYYY-MM-DD');
}