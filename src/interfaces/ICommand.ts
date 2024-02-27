interface ICommand {
    readonly commandName : string;
    RunCommand(): void;
}