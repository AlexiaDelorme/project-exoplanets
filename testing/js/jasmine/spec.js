describe("Conversion", function() {

    describe("Parsing tests", function() {

        it("should return 1.15", function() {
            expect(convert_string_to_float("1.15")).toBe("1.15");
        });


        it("should return 2.15", function() {
            expect(convert_string_to_float("2.155")).toBe("2.15");
        });

        it("should return 3.00", function() {
            expect(convert_string_to_float("3")).toBe("3.00");
        });


        it("should return 0.00", function() {
            expect(convert_string_to_float(0)).toBe("0.00");
        });

    });
});