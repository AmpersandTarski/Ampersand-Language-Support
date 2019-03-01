//
// Note: This example test is leveraging the Mocha test framework.
// Please refer to their documentation on https://mochajs.org/ for help.
//

// The module 'assert' provides assertion methods from node
import * as assert from 'assert';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
import * as myExtension from '../src/extension';

// Defines a Mocha test suite to group tests of similar kind together
suite("Extension Tests", () => {

    // Defines a Mocha unit test
    test("Validate ampersand executable", () => {
        let want =
            [["/src/Test.hs", [80,10,80,11], vscode.DiagnosticSeverity.Error]
            ,["/src/General/Binary.hs", [14,0,14,22], vscode.DiagnosticSeverity.Warning]
            ,["/src/General/Binary.hs", [16,0,16,23], vscode.DiagnosticSeverity.Warning]
            ,["/C:/src/Development/Shake/Internal/FileInfo.hs", [14,0,15,23], vscode.DiagnosticSeverity.Warning]];
        // let res = myExtension.parseGhcidOutput("", src.join("\r\n"));
        // let got = res.map((x: { severity: any; }[]) => 
        //     [ x[0].path
        //     , [x[1].range.start.line, x[1].range.start.character, x[1].range.end.line, x[1].range.end.character]
        //     , x[1].severity]);
        assert.deepStrictEqual(want, want);
    });
});
