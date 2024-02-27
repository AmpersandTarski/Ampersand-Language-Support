interface ICommand {
    readonly commandName : string;
    RunCommand(): any;
}